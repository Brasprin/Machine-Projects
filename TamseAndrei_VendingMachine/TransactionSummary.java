import java.util.ArrayList;

/**
 * A class representing a transaction summary of a {@link RegularVendingMachine}.
 * It contains methods to generate and retrieve the total sales information for
 * all items in the vending machine.
 */
public class TransactionSummary {

    /**
     * The {@link RegularVendingMachine} object for which the transaction summary is
     * generated.
     */
    private RegularVendingMachine vendingMachine;

    /**
     * Constructs a new TransactionSummary object with the specified {@link RegularVendingMachine}.
     *
     * @param vendingMachine The vending machine for which the transaction summary is generated.
     */
    public TransactionSummary(RegularVendingMachine vendingMachine){
        this.vendingMachine = vendingMachine;
    }

    /**
     * Retrieves the total sales information for all items in the vending machine.
     *
     * @return An {@link ArrayList} of {@link SalesInfo} objects representing the
     *         total sales information.
     *         Each SalesInfo object contains details about an item's sales,
     *         including its name, initial stock, current stock, quantity sold,
     *         unit price, and total earnings.
     */
    public ArrayList<SalesInfo> getTotalSales() {
        ArrayList<SalesInfo> salesList = new ArrayList<>();

        if (vendingMachine.getSlot() != null) {
            ItemSlot[] itemSlots = vendingMachine.getSlot();

            for (int i = 0; i < itemSlots.length; i++) {
                Item item = itemSlots[i].getItem();

                if (item != null) {
                    String itemName = item.getItemName();
                    int iniStock = itemSlots[i].getInitialStock();
                    int curStock = itemSlots[i].getCurrentStock();
                    int quantitySold = itemSlots[i].getNumSoldItems();
                    float unitPrice = item.getPrice();
                    float itemTotal = unitPrice * quantitySold;

                    SalesInfo salesInfo = new SalesInfo(itemName, iniStock, curStock, quantitySold, unitPrice, itemTotal);
                    salesList.add(salesInfo);
                }
            }
        }
        return salesList;
    }
}
