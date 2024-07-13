"""
    CSNETWK - S11.
    Machine Project - File Exchange System
    Author:
    - Tamse, Andrei
"""

import socket
import os
import threading
import argparse
import datetime

BUFFER_SIZE = 1024
MAIN_DIRECTORY = os.getcwd()
SERVER_DIRECTORY = './server_files/'

registered_handles = set()
registered_handles_lock = threading.Lock()


def handle_server(server_ip_add, port):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((server_ip_add, port))
    server_socket.listen(5)
    print(f"Server listening on {server_ip_add}:{port}")
    
    try:
        while True:
            client_socket, client_address = server_socket.accept()
            client_thread = threading.Thread(target=handle_client, args=(client_socket, client_address))
            client_thread.start()
    except KeyboardInterrupt:
        print("Server shutting down")
    finally:
        server_socket.close()
        
def handle_client(client_socket, client_address):
    print(f"Accepted connection from {client_address}")
    client_info = {'connected': True, 'registered': False, 'username': None}
    
    try:
        while client_info['connected']:
            data = client_socket.recv(BUFFER_SIZE).decode('utf-8').strip()
            if not data:
                break
            process_command(data, client_socket, client_info, client_address)
    except Exception as e:
        print(f"Error handling client {client_address}: {e}")
    
def handle_exists(handle):
    with registered_handles_lock:
        return handle in registered_handles

def add_handle(handle):
    with registered_handles_lock:
        if handle in registered_handles:
            return False
        else:
            registered_handles.add(handle)
            return True 

# Handle server and socket commands.        
def process_command(command, client_socket, client_info, client_address):
    parts = command.split()
    action = parts[0].lower()
    handle = None
    filename = None
    
    if len(parts) >= 2:
        handle = parts[1].capitalize()
        filename = parts[1]
    
    if action == "/leave":
        client_info['connected'] = False
        try:
            client_socket.shutdown(socket.SHUT_RDWR)
            client_socket.close()
            print(f"Connection {client_address} closed")
        except Exception as e:
            print(f"Error disconnecting from server: {e}")
    elif not client_info['registered']:
        if action.startswith("/store") or action.startswith("/dir") or action.startswith("/get"):
            client_socket.send("Error: You must be registered to use this command.".encode('utf-8'))
            print(f"Error: You must be registered to use this command.")
        elif action.startswith("/register"):
            if handle_exists(handle):
                client_socket.send("Error: Handle or alias already exists.".encode('utf-8'))
                print("Error: Handle or alias already exists.")
            else:
                add_handle(handle)
                client_info['registered'] = True
                client_info['username'] = handle
                
                # Create user-specific directory
                user_directory = os.path.join(MAIN_DIRECTORY, handle + "_files")
                os.makedirs(user_directory, exist_ok=True)
                
                client_socket.send(f"Welcome {handle}!".encode('utf-8'))
                print(f"Welcome {handle}!")
    elif client_info['registered']:
        user_directory = os.path.join(MAIN_DIRECTORY, client_info['username'] + "_files")
        if action.startswith("/register"):
            client_socket.send(f"You're already registered {client_info['username']}.".encode('utf-8'))
            print(f"You're already registered {client_info['username']}.")
        elif action == "/store":
            if not os.path.isfile(os.path.join(user_directory, filename)):
                client_socket.send("Error: File not found.".encode('utf-8'))
                print("Error: File not found.")
            else:
                client_socket.send(f"File stored to Server: {filename}".encode('utf-8'))
                receive_file(filename, client_socket, client_info['username'])
        elif action == "/dir":
            send_directory_list(client_socket)
        elif action == "/get":
            if not os.path.isfile(os.path.join(SERVER_DIRECTORY, filename)):
                client_socket.send("Error: File not found.".encode('utf-8'))
                print("Error: File not found.")
            else:   
                send_file(filename, client_socket, client_info['username'])


def send_directory_list(client_socket):
    try:
        files = os.listdir(SERVER_DIRECTORY)
        file_list = '\n'.join(files)
        client_socket.send(f"\nServer Directory:\n{file_list}\n".encode('utf-8'))
    except Exception as e:
        print(f"Error sending directory list: {e}")
        client_socket.send(f"Error: {str(e)}".encode('utf-8'))


def receive_file(filename, client_socket, username):
    try:
        file_info = client_socket.recv(BUFFER_SIZE).decode()
        if '|' not in file_info:
            raise ValueError("Invalid file info format")
        
        filename, filesize_str = file_info.split('|')
        filesize = int(filesize_str)

        file_path = os.path.join(SERVER_DIRECTORY, filename)

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
            print(f"{username} {timestamp}: Uploaded {filename}")
            client_socket.send(f"{username} {timestamp}: Uploaded {filename}".encode())
        else:
            raise Exception("Error: Incomplete file transfer")

    except FileNotFoundError:
        print(f"File '{filename}' not found.")
        client_socket.send("FileNotFound".encode())
    except Exception as e:
        print(f"Error receiving file: {e}")
        client_socket.send(f"Error receiving file {str(e)}".encode())


def send_file(filename, client_socket, username):
    try:
        file_path = os.path.join(SERVER_DIRECTORY, filename)
        if not os.path.isfile(file_path):
            client_socket.send(f"Error: File '{filename}' not found.".encode('utf-8'))
            print(f"Error: File '{filename}' not found.")
            return
        else:
            client_socket.send(f"Path Found".encode('utf-8'))
        
        file_size = os.path.getsize(file_path)
        client_socket.send(f"{filename}|{file_size}".encode())
        
        with open(file_path, 'rb') as f:
            bytes_sent = 0  
            while True:
                data = f.read(BUFFER_SIZE)
                if not data:
                    break
                client_socket.send(data)
                bytes_sent += len(data)
        
        client_socket.send("File sent successfully".encode('utf-8'))
        print(f"File '{filename}' sent successfully.")
    
    except Exception as e:
        client_socket.send(f"Error sending file: {str(e)}".encode('utf-8'))
        print(f"Error sending file: {e}")



def main():
    parser = argparse.ArgumentParser(description='File Exchange Server')
    parser.add_argument('server_ip_add', type=str)
    parser.add_argument('port', type=int)
    args = parser.parse_args()

    server_ip_add = args.server_ip_add
    port = args.port

    handle_server(server_ip_add, port)

if __name__ == "__main__":
    main()
