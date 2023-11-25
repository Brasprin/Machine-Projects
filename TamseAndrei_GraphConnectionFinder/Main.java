import java.util.Scanner;
import java.io.*;

/**
 * @author Andrei Tamse
 * @author Diego Roa
 * @author Mark Ang
 */
public class Main{

    public static void main(String [] args) {
        String fileLocation = filePath();
        int vertexSize = getVertexSize(fileLocation);

        Graph graphData = new Graph(vertexSize);
        graphData.readEdgesFromFile(fileLocation);

        int choice;

        do {
            choice = mainMenu();
            if (choice == 1)
                graphData.displayFriends();
            else if (choice == 2)
                graphData.findConnection();
            else if (choice == 3)
                System.out.println("Program Exited.");
            else
                System.out.println("Invalid choice.");
        } while (choice != 3);
    }

    /**
     * Displays the file thta contains the data that allows the user to select a file name from a menu and
     * constructs the file path accordingly.
     *
     * @return The file path as a String or null if the user chooses to exit.
     */
    private static String filePath() {
        int choice;
        String fileLocation = "/Users/andrei/IdeaProjects/DSALG-JAVA/data/";

        System.out.println("\nChoice File Name To Test: ");
        System.out.println("[1] Caltech36.txt");
        System.out.println("[2] Harvard1.txt");
        System.out.println("[3] Rice31.txt");
        System.out.println("[4] Stanford3.txt");
        System.out.println("[5] Trinity100.txt");
        System.out.println("[6] Exit");

        Scanner scan = new Scanner(System.in);

        while (true) {
            System.out.print("\nEnter your Choice: ");
            choice = scan.nextInt();

            if (choice >= 1 && choice <= 6)
                break;

            System.out.println("Invalid choice. Please try again.");
        }

        if (choice == 6)
            return null;

        switch (choice) {
            case 1:
                fileLocation += "Caltech36";
                break;
            case 2:
                fileLocation += "Harvard1";
                break;
            case 3:
                fileLocation += "Rice31";
                break;
            case 4:
                fileLocation += "Stanford3";
                break;
            case 5:
                fileLocation += "Trinity100";
                break;
        }

        fileLocation += ".txt";
        return fileLocation;
    }

    /**
     * Reads the first line of the specified file and extracts the vertex size from it.
     *
     * @param fileLocation The file path as a String.
     * @return The number of vertices in the graph.
     */
    private static int getVertexSize(String fileLocation) {
        try {
            BufferedReader reader = new BufferedReader(new FileReader(fileLocation));
            String firstLine = reader.readLine();
            if (firstLine != null) {
                String[] data = firstLine.split(" ");
                return Integer.parseInt(data[0]);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return 0;
    }


    /**
     * Displays the main menu of the application. It allows the user to select options from the menu
     * and returns the chosen option.
     *
     * @return The user's selected option as an integer.
     */
    private static int mainMenu() {
        Scanner scanner = new Scanner(System.in);
        System.out.println("MAIN MENU");
        System.out.println("[1] Get friend list");
        System.out.println("[2] Get connection");
        System.out.println("[3] Exit");
        System.out.print("Enter your Choice: ");

        int choice = scanner.nextInt();
        scanner.nextLine();

        System.out.println();

        return choice;
    }
}
