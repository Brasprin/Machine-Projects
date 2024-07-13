"""
    CSNETWK - S11.
    Machine Project - File Exchange System
    Author:
    - Tamse, Andrei
"""

import os
import socket
import sys
import datetime

BUFFER_SIZE = 1024
SERVER_IP_ADD = "127.0.0.1"
PORT = 12345
CONNECTION_STATUS = False
MAIN_DIRECTORY = os.getcwd()

def join_server(server_ip_add, port):
    global CONNECTION_STATUS
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        client_socket.connect((server_ip_add, port))
        print("Connection to the File Exchange Server is successful!")
        CONNECTION_STATUS = True
        return client_socket
    except Exception as e:
        print(f"Error: Connection to the Server has failed! Please check IP Address and Port Number.")
        client_socket.close()

def process_command(command, client_socket, username):
    global CONNECTION_STATUS, SERVER_IP_ADD, PORT
    parts = command.split()
    
    if not any(command.startswith(cmd) for cmd in ['/join', '/leave', '/register', '/store', '/dir', '/get', '/?']):
        print("Error: Command not found.")
    elif command == "/?":
        print("\nAvailable commands:\n/join <server_ip_add> <port>\n/leave\n/register <handle>\n/store <filename>\n/dir\n/get <filename>\n/?\n")
    elif (command.startswith("/register") or command.startswith("/store") or command.startswith("/get")) and len(parts) != 2:
        print("Error: Command parameters do not match or are not allowed.")
    elif command.startswith("/join") and len(parts) != 3:
        print("Error: Command parameters do not match or are not allowed.")
    elif not CONNECTION_STATUS:
        if command == "/leave":
            print("Error: Disconnection failed. Please connect to the server first.") 
        elif command.startswith("/join") and len(parts) == 3:
            server_ip_add = parts[1]
            try:
                port = int(parts[2])
            except ValueError:
                print("Error: Connection to the Server has failed! Please check IP Address and Port Number.")
                return client_socket
            
            if (server_ip_add != SERVER_IP_ADD or port != PORT):
                print("Error: Connection to the Server has failed! Please check IP Address and Port Number.")
                return client_socket
            else:
                client_socket = join_server(server_ip_add, port)    
                if client_socket:
                    CONNECTION_STATUS = True
        else:
            print("Error: Please connect to the server first.")
            
    # Process command when already connected on the server.
    elif CONNECTION_STATUS:
        action = parts[0].lower()
        if action == "/join" and len(parts) == 3:
            print("Error: You are already connected to the server.")
        elif action == "/store" or action == "/get":
            try:
                client_socket.send(command.encode('utf-8'))
                response = client_socket.recv(BUFFER_SIZE).decode('utf-8')
                if not response.startswith("Error:"):
                    filename = parts[1]
                    if action == "/store":
                        upload_file(filename, client_socket, username)
                    elif action == "/get":
                        get_file(filename, client_socket, username)
                else:
                    print(response)
            except Exception as e:
                print(f"Error receiving data: {e}")
        elif action == "/leave":
            CONNECTION_STATUS = False
            client_socket.send(command.encode('utf-8'))
            print("Connection closed. Thank you!")
        else:
            client_socket.send(command.encode('utf-8'))
            response = client_socket.recv(BUFFER_SIZE).decode('utf-8')
            print(response)

    return client_socket


def upload_file(filename, client_socket, username):
    try:
        user_directory = os.path.join(MAIN_DIRECTORY, username + "_files")
        file_path = os.path.join(user_directory, filename)
        file_size = os.path.getsize(file_path)
        client_socket.send(f"{filename}|{file_size}".encode())
        
        with open(file_path, 'rb') as f:
            bytes_sent = 0  
            while bytes_sent < file_size:
                data = f.read(BUFFER_SIZE)
                if not data:
                    break
                client_socket.send(data)
                bytes_sent += len(data)
        
        response = client_socket.recv(BUFFER_SIZE).decode()
        print(response)
    except Exception as e:
        print(f"Error sending file: {e}")
         
        
def get_file(filename, client_socket, username):
    try:
        client_socket.send(filename.encode('utf-8'))
        
        response = client_socket.recv(BUFFER_SIZE).decode('utf-8')
        if response.startswith("Error:"):
            print(response)
            return
        
        filename, filesize_str = response.split('|')
        filesize = int(filesize_str)
        
        file_path = os.path.join(MAIN_DIRECTORY, username + "_files", filename)
        bytes_received = 0
        with open(file_path, 'wb') as f:
            while bytes_received < filesize:
                data = client_socket.recv(min(BUFFER_SIZE, filesize - bytes_received))
                if not data:
                    break
                f.write(data)
                bytes_received += len(data)
        
        if bytes_received == filesize:
            timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"{username} {timestamp}: Got {filename}")
        else:
            raise Exception("Error: Incomplete file transfer")
        
    except FileNotFoundError:
        print(f"File '{filename}' not found.")
        client_socket.send("FileNotFound".encode('utf-8'))
    except Exception as e:
        print(f"Error receiving file: {e}")
        client_socket.send(f"Error receiving file {str(e)}".encode('utf-8'))
        
def main():
    if len(sys.argv) < 2:
        print("Error: Username parameter is missing.")
        return
    
    username = sys.argv[1]
    client_socket = None

    try:
        while True:
            command = input(f"{username}> ").strip()
            client_socket = process_command(command, client_socket, username)
    except KeyboardInterrupt:
        print("\nExiting...")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if client_socket:
            client_socket.close()

if __name__ == "__main__":
    main()
