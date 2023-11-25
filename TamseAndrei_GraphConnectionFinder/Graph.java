import java.io.*;
import java.util.*;


/**
 * Represents a graph data structure using an adjacency list. The graph is initialized with the specified
 * number of vertices.
 *
 * @author Andrei Tamse
 * @author Diego Roa
 * @author Mark Ang
 */
public class Graph {

    private final ArrayList<LinkedList<Integer>> adjacencyList;

    /**
     * Constructs a graph with the given number of vertices. It also Initializes the adjacency list and creates an
     * empty linked list for each vertex.
     *
     * @param numVertices The number of vertices in the graph.
     */
    public Graph (int numVertices){
        adjacencyList = new ArrayList<>(numVertices);

        for (int i = 0; i < numVertices; i++)
            adjacencyList.add(new LinkedList<>());
    }


    /**
     * Reads the edges of the graph from a file and insert it to the adjacency list. The file should contain edge
     * information in the form of "source destination" pairs. The first line of the file is discarded as it is
     * assumed to contain the number of vertices.
     *
     * @param fileLocation The file path from which to read the graph data.
     */
    public void readEdgesFromFile(String fileLocation) {
        try {
            BufferedReader reader = new BufferedReader(new FileReader(fileLocation));
            String line;

            reader.readLine(); // discard first line.

            while ((line = reader.readLine()) != null) {
                String[] data = line.split(" ");
                int source = Integer.parseInt(data[0]);
                int destination = Integer.parseInt(data[1]);

                adjacencyList.get(source).add(destination);
            }

            reader.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        System.out.println("\nGraph Loaded!\n");
    }

    /**
     * Displays the friends of a person by their ID. The user is prompted to enter the ID of the person whose friends
     * need to be displayed. If the person ID is valid, the method prints the number of friends and their IDs.
     */
    public void displayFriends(){
        Scanner scan = new Scanner(System.in);
        System.out.print("Enter ID of person: ");
        int vertex = scan.nextInt();

        if (vertex >= 0 && vertex < adjacencyList.size()){
            LinkedList<Integer> friends = adjacencyList.get(vertex);

            System.out.println("Person " + vertex + " has " + friends.size() + " friends!");
            System.out.print("List of Friends: ");

            for (Integer friend : friends)
                System.out.print(friend + " ");

            System.out.println("\n");
        }
        else
            System.out.println("Invalid Person.\n");
    }

    /**
     * Finds a connection between two people by their IDs in the graph. The user is prompted to enter the IDs of the
     * first person and the second person to find a connection between them. If a connection is found, it prints the
     * path from the first person to the second person.
     */
    public void findConnection() {
        Scanner scan = new Scanner(System.in);
        System.out.print("Enter ID of first person: ");
        int person1 = scan.nextInt();
        System.out.print("Enter ID of second person: ");
        int person2 = scan.nextInt();

        if (person1 >= 0 && person1 < adjacencyList.size() && person2 >= 0 && person2 < adjacencyList.size()) {
            boolean[] visited = new boolean[adjacencyList.size()];
            int[] parent = new int[adjacencyList.size()];

            LinkedList<Integer> queue = new LinkedList<>();
            queue.add(person1);
            visited[person1] = true;
            parent[person1] = -1;

            while (!queue.isEmpty()) {
                int currentVertex = queue.poll();

                if (currentVertex == person2) { // Check if the currentVertex is equal to the target vertex (person2)
                    printConnection(person1, person2, parent);
                    return;
                }

                LinkedList<Integer> friends = adjacencyList.get(currentVertex);

                for (int friend : friends) {
                    if (!visited[friend]) {
                        queue.add(friend); // Add the friend to the queue for checking
                        visited[friend] = true;
                        parent[friend] = currentVertex;   // Set the parent of the friend to be the currentVertex
                    }
                }
            }

            System.out.println("Cannot find a connection between " + person1 + " and " + person2 + "\n");
        } else
            System.out.println("Invalid Person.\n");
    }

    /**
     * Prints the connection between two people in the graph. The array of parents obtained from the breadth-first search
     * algorithm, that traces the path from person1 to person2 and prints the sequence of friends connecting them.
     *
     * @param person1 The ID of the first person.
     * @param person2 The ID of the second person.
     * @param parent An array representing the parent of each person found during the breadth-first search.
     */
    private void printConnection(int person1, int person2, int[] parent) {
        ArrayList<Integer> path = new ArrayList<>();

        int currentPerson = person2;
        while (currentPerson != -1) {
            path.add(currentPerson);
            currentPerson = parent[currentPerson];
        }

        Collections.reverse(path); // Reverse the arrayList for display

        System.out.println("There is a connection from " + person1 + " to " + person2);

        for (int i = 0; i < path.size() - 1; i++)
            System.out.println(path.get(i) + " is friends with " + path.get(i + 1));

        System.out.println("\n");
    }
}
