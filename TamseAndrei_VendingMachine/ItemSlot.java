import java.util.ArrayList;

/**
 * ItemSlot is the slot inside a vending machine. It includes an item object,
 * quantity of item object, slot's capacity, and item's initial stock.
 */
public class ItemSlot {

    private final int SLOTCAPACITY;
    private ArrayList<Item> itemInSlot;
    private int initialStock;

    /**
     * Creates ItemSlot object given the slot capacity. Quantity and Initial stock set to 0.
     *
     * @param slotCapacity slot capacity of each ItemSlot object
     */
    public ItemSlot(int slotCapacity) {
        SLOTCAPACITY = slotCapacity;
        itemInSlot = new ArrayList<>();
        initialStock = 0;
    }

    /**
     * Adds multiple item objects to the ItemSlot based on the specified quantity.
     * If the slot is empty and the quantity is valid, the items will be added.
     *
     * @param name        The name of the item to add.
     * @param price       The price of the item to add.
     * @param calories    The calories of the item to add.
     * @param description The description of the item to add.
     * @param quantity    The quantity of items to add.
     */
    public void addItem(String name, int price, float calories, String description, int quantity) {
        if (itemInSlot.isEmpty() && isValidQuantity(quantity)) {
            for (int i = 0; i < quantity; i++) {
                Item itemToAdd = new Item(name, price, calories, description);
                itemInSlot.add(itemToAdd);
            }
            initialStock += quantity;
        }
    }

    /**
     * Updates the stock of the item in the ItemSlot.
     *
     * @param quantityToAdd number of items to be added
     */
    public void restockItem(int quantityToAdd) {
        if (isValidQuantity(quantityToAdd)) {
            Item item = itemInSlot.get(0);
            for (int i = 0; i < quantityToAdd; i++) {
                Item newItem = new Item(item.getItemName(), item.getPrice(), item.getCalories(), item.getDescription());
                itemInSlot.add(newItem);
            }
            initialStock += quantityToAdd;
        }
    }

    /**
     * Dispenses the current item if it is in stock.
     */
    public void dispenseItem() {
        if (!itemInSlot.isEmpty())
            itemInSlot.remove(0);
    }

    /**
     * Checks if the input is a valid quantity not less than or equal to 0.
     *
     * @param quantityToAdd amount of quantity to add
     * @return true if input is valid false otherwise
     */
    public boolean isValidQuantity(int quantityToAdd) {
        return quantityToAdd > 0 && itemInSlot.size() + quantityToAdd <= SLOTCAPACITY;
    }

    /**
     * Checks if ItemSlot is currently occupied by an object.
     *
     * @return true if slot is unoccupied, false otherwise
     */
    public boolean isEmpty() {
        return itemInSlot.size() == 0;
    }

    /**
     * This method deletes the item it currently holds and sets initial stock to 0.
     */
    public void deleteItem() {
        itemInSlot.clear();
        initialStock = 0;
    }

    /**
     * This method returns the item in the ItemSlot
     *
     * @return the current Item
     */

    public Item getItem() {
        if (!itemInSlot.isEmpty())
            return itemInSlot.get(0);
        else
            return null;
    }

    /**
     * Returns current quantity of the item
     *
     * @return quantity of the item
     */
    public int getQuantity() {
        return itemInSlot.size();
    }

    /**
     * Returns initial stock of the item when stock was added
     *
     * @return initial stock of the Item
     */
    public int getInitialStock() {
        return initialStock;
    }

    /**
     * Retrieves the current stock count of items in the vending machine.
     *
     * @return The number of items currently in the vending machine as an integer value.
     */
    public int getCurrentStock() {
        return itemInSlot.size();
    }

    /**
     * This method returns the number of items sold by subtracting current quantity
     * to the initial stock.
     *
     * @return the number of sold items in the ItemSlot
     */
    public int getNumSoldItems() {
        return initialStock - itemInSlot.size();
    }

    /**
     * Retrieves the slot capacity of the vending machine.
     *
     * @return The slot capacity as an integer value.
     */
    public int getSlotCapacity() {
        return SLOTCAPACITY;
    }
}
