/**
 * The entry point of the Vending Machine application.
 * Initializes the MVC components (View, Model, and Controller) and starts the application.
 *
 * @author Aljirah Y. Resurreccion
 * @author Andrei G. Tamse
 */
public class Main {

    public static void main(String[] args) {
        VendingView vendingView = new VendingView();
        VendingModel vendingModel = new VendingModel();
        new VendingController(vendingView, vendingModel);
    }

}

