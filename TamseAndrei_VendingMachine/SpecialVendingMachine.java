import java.util.ArrayList;
import java.util.LinkedHashMap;

/**
 * A specialized type of vending machine that extends the RegularVendingMachine class.
 * This class represents a special vending machine that dispense yoghurt, toppings and sauces.
 */
public class SpecialVendingMachine extends RegularVendingMachine {

    /** The slot that holds the yoghurt item. */
    private ItemSlot yoghurtSlot;

    /** An array of slots that hold the sauces. */
    private ItemSlot[] sauceSlot;

    /** An array of items representing the current queue of selected items. */
    private Item[] itemQueue;

    /**
     * Constructs a SpecialVendingMachine object with the specified name, slot
     * capacity, and sauce slot capacity.
     *
     * @param vendingMachineName The name of the special vending machine.
     * @param slotCapacity       The capacity of each regular slot in the vending machine.
     * @param slotSauceCapacity  The capacity of each sauce slot in the vending machine.
     */
    public SpecialVendingMachine(String vendingMachineName, int slotCapacity, int slotSauceCapacity) {
        super(vendingMachineName, 8, slotCapacity);

        yoghurtSlot = new ItemSlot(slotCapacity);
        sauceSlot = new ItemSlot[5];
        for (int i = 0; i < sauceSlot.length; i++)
            sauceSlot[i] = new ItemSlot(slotSauceCapacity);
        itemQueue = new Item[3];

        // sets vending machine yoghurt
        yoghurtSlot.addItem("Vanilla Yoghurt", 40, 15, "yoghurt", slotCapacity);

        // sets vending machine toppings
        slot[0].addItem("Mango", 15, 15, "fruit", slotCapacity);
        slot[1].addItem("Strawberry", 25, 15, "fruit", slotCapacity);
        slot[2].addItem("Lychee", 25, 15, "fruit", slotCapacity);
        slot[3].addItem("Grapes", 20, 15, "fruit", slotCapacity);
        slot[4].addItem("Oreo", 15, 30, "crunches", slotCapacity);
        slot[5].addItem("M&M's", 20, 25, "crunches", slotCapacity);
        slot[6].addItem("Mixed Nuts", 25, 10, "crunches", slotCapacity);
        slot[7].addItem("Cheesecake", 20, 20, "crunches", slotCapacity);

        // sets vending machine sauces
        sauceSlot[0].addItem("Salted Chocolate", 10, 50, "sauces", slotSauceCapacity);
        sauceSlot[1].addItem("Biscoff", 15, 40, "sauces", slotSauceCapacity);
        sauceSlot[2].addItem("Honey", 15, 30, "sauces", slotSauceCapacity);
        sauceSlot[3].addItem("Matcha", 15, 40, "sauces", slotSauceCapacity);
        sauceSlot[4].addItem("Caramel", 10, 50, "sauces", slotSauceCapacity);
    }

    /**
     * Registers a new sauce in the sauce slots of the special vending machine.
     *
     * @param sauceName   The name of the sauce to be registered.
     * @param price       The price of the sauce.
     * @param calories    The calorie count of the sauce.
     * @param description The description of the sauce.
     * @param quantity    The quantity of the sauce to be added.
     * @return True if the sauce is successfully registered; false otherwise (if the sauce slots are full).
     */
    public boolean registerSauce(String sauceName, int price, float calories, String description, int quantity) {
        int emptySlotIndex = -1;

        for (int i = 0; i < sauceSlot.length; i++)
            if (sauceSlot[i].isEmpty()) {
                emptySlotIndex = i;
                break;
            }

        // Check if slots are already full
        if (emptySlotIndex == -1)
            return false;

        sauceSlot[emptySlotIndex].addItem(sauceName, price, calories, description, quantity);
        return true;
    }


    /**
     * Refills the yoghurt tank by restocking the yoghurt slot to its full capacity.
     */
    public  void refillYoghurtTank(){
        yoghurtSlot.restockItem(yoghurtSlot.getSlotCapacity() - yoghurtSlot.getCurrentStock());
    }

    /**
     * Updates the quantity of a specific sauce in the vending machine by adding the specified quantity.
     *
     * @param sauceNameToEdit   The sauce item to update the quantity for.
     * @param quantityToAdd The quantity to add to the existing quantity of the sauce item.
     */
    public void updateSauceQuantity(String sauceNameToEdit, int quantityToAdd) {
        ItemSlot[] sauceSlots = getSauceSlot();

        for (ItemSlot itemSlot : sauceSlots)
            if (itemSlot.getItem() != null && itemSlot.getItem().getItemName().equalsIgnoreCase(sauceNameToEdit)) {
                itemSlot.restockItem(quantityToAdd);
                break;
            }
    }

    /**
     * Updates the price of the specified sauce item.
     *
     * @param itemToEdit The sauce item to update the price for.
     * @param newPrice   The new price to set for the sauce item.
     */
    public void updateSaucePrice(String itemToEdit, int newPrice) {
        ItemSlot[] itemSlots = getSauceSlot();

        for (ItemSlot itemSlot : itemSlots) {
            Item item = itemSlot.getItem();
            if (item != null && item.getItemName().equalsIgnoreCase(itemToEdit)) {
                item.setNewPrice(newPrice);
                break;
            }
        }
    }

    /**
     * Checks out the made product and processes the transaction.
     *
     * @return 0 if the transaction is successful and the remaining balance after the purchase,
     *         1 if the user has insufficient balance to complete the purchase,
     *         2 if there is not enough change in the stash to complete the purchase,
     *         3 if the yoghurtSlot is empty or null, indicating no product to purchase.
     */
    public int checkOutMadeProduct() {
        int balance = stash.getBalance();
        int totalItemCost = 0;
        ArrayList<String> itemName = new ArrayList<>(); // stores names of items in queue

        if (yoghurtSlot != null) {
            for (int i = 0; i < itemQueue.length; i++)
                if (itemQueue[i] != null) {
                    totalItemCost += itemQueue[i].getPrice();
                    itemName.add(itemQueue[i].getItemName());
                }

            totalItemCost += yoghurtSlot.getItem().getPrice();

            if (balance < totalItemCost)
                return 1;

            int remainingBalance = balance - totalItemCost;

            if (isEnoughInStash(totalItemCost)) {
                yoghurtSlot.dispenseItem();
                for (int i = 0; i < itemName.size(); i++) // searches through slot
                    for (int j = 0; j < slot.length; j++)
                        if (itemName.get(i).equalsIgnoreCase(slot[j].getItem().getItemName())) {
                            slot[j].dispenseItem();
                            itemQueue[i] = null;
                            break;
                        }
                for (int i = 0; i < itemName.size(); i++) // searches through sauceSlot
                    for (int j = 0; j < sauceSlot.length; j++)
                        if (itemName.get(i).equalsIgnoreCase(sauceSlot[j].getItem().getItemName())) {
                            sauceSlot[j].dispenseItem();
                            itemQueue[i] = null;
                            break;
                        }
                itemName.removeAll(itemName); // removes all itemNames in arrayList
                transferStashToVault(totalItemCost);
                stash.withdrawEverything();
                return remainingBalance;

            } else if (isEnoughChange(remainingBalance)) {
                yoghurtSlot.dispenseItem();
                for (int i = 0; i < itemName.size(); i++) // searches through slot
                    for (int j = 0; j < slot.length; j++)
                        if (itemName.get(i).equalsIgnoreCase(slot[j].getItem().getItemName())) {
                            slot[j].dispenseItem();
                            itemQueue[i] = null;
                            break;
                        }
                for (int i = 0; i < itemName.size(); i++) // searches through sauceSlot
                    for (int j = 0; j < sauceSlot.length; j++)
                        if (itemName.get(i).equalsIgnoreCase(sauceSlot[j].getItem().getItemName())) {
                            sauceSlot[j].dispenseItem();
                            itemQueue[i] = null;
                            break;
                        }
                itemName.removeAll(itemName); // removes all itemNames in arrayList
                transferStashToVault(balance);
                changeCount = dispenseChange(remainingBalance);
                stash.withdrawEverything();
                return remainingBalance;
            }
            else
                return 2;
        }
        return 3;
    }

    /**
     * Empties the specified sauce slot by removing all items from it.
     *
     * @param sauceNameToEdit The sauce item to remove from the sauce slot.
     */
    public void emptySauceSlot(String sauceNameToEdit) {
        ItemSlot[] sauceSlots = getSauceSlot();

        for (ItemSlot itemSlot : sauceSlots) {
            Item item = itemSlot.getItem();
            if (item != null && item.getItemName().equals(sauceNameToEdit)) {
                itemSlot.deleteItem(); // Call the deleteItem method to remove all items from the slot containing itemToEdit.
                break;
            }
        }
    }

    /**
     * Adds the item from the specified regular item slot to the item queue.
     *
     * @param slotNum The slot number of the item to add to the queue.
     * @return true if the item was successfully added to the queue, false otherwise.
     */
    public boolean addItemToQueue(int slotNum) {
        if (isItemAvailable(slot[slotNum])) {
            for (int i = 0; i < itemQueue.length; i++) {
                if (itemQueue[i] == null) {
                    itemQueue[i] = slot[slotNum].getItem();
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Adds the sauce from the specified sauce slot to the item queue.
     *
     * @param slotNum The slot number of the sauce to add to the queue.
     * @return true if the sauce was successfully added to the queue, false otherwise.
     */
    public boolean addSauceToQueue(int slotNum) {
        if (isSauceAvailable(sauceSlot[slotNum])) {
            for (int i = 0; i < itemQueue.length; i++) {
                if (itemQueue[i] == null) {
                    itemQueue[i] = sauceSlot[slotNum].getItem();
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Removes the item at the specified index from the item queue.
     *
     * @param itemNum The index of the item to be removed from the queue.
     */
    public void editQueue(int itemNum) {
        if (itemQueue != null)
            itemQueue[itemNum] = null;
    }

    /**
     * Empties the item queue by removing all items from it.
     */
    public void emptyQueue() {
        if (itemQueue != null) {
            for (int i = 0; i < itemQueue.length; i++) {
                itemQueue[i] = null;
            }
        }
    }

    /**
     * Checks if the sauce with the given name is unique and not already registered
     * in the sauce slots.
     *
     * @param sauceName The name of the sauce to check.
     * @return True if the sauce is unique; false otherwise.
     */
    public boolean isSauceUnique(String sauceName) {
        for (ItemSlot itemSlot : sauceSlot) {
            Item item = itemSlot.getItem();
            if (item != null && item.getItemName().equalsIgnoreCase(sauceName))
                return false;
        }
        return true;
    }
    /**
     * Checks if the specified sauce slot contains an available sauce item.
     *
     * @param sauceSlot The sauce slot to check for availability.
     * @return true if the sauce slot is not empty and contains a sauce item, false otherwise.
     */
    public boolean isSauceAvailable(ItemSlot sauceSlot) {
        return !sauceSlot.isEmpty();
    }

    /**
     * Checks if the item queue in the special vending machine is empty.
     *
     * @return true if the item queue is empty, false otherwise.
     */
    public boolean isItemQueueEmpty(){
        if (itemQueue == null)
            return true;
        for (Item item : itemQueue)
            if (item != null)
                return false;

        return true;
    }

    /**
     * Retrieves an array of sauce slots in the special vending machine.
     *
     * @return An array of ItemSlots representing the sauce slots in the special vending machine.
     */
    public ItemSlot[] getSauceSlot() {
        return sauceSlot;
    }

    /**
     * Retrieves the yoghurt slot in the special vending machine.
     *
     * @return The ItemSlot representing the yoghurt slot in the special vending machine.
     */
    public ItemSlot getYoghurtSlot() {
        return yoghurtSlot;
    }

    /**
     * Retrieves the current item queue in the special vending machine.
     *
     * @return An array of Items representing the items in the queue in the special vending machine.
     */
    public Item[] getItemQueue() {
        return itemQueue;
    }

    /**
     * Searches for the sauce slot that contains the specified sauce name.
     *
     * @param sauceName The name of the sauce to search for.
     * @return The ItemSlot that contains the specified sauce, or null if not found.
     */
    public ItemSlot getSauceSlotBySauceName(String sauceName) {
        for (ItemSlot itemSlot : sauceSlot)
            if (itemSlot != null && itemSlot.getItem() != null && itemSlot.getItem().getItemName().equalsIgnoreCase(sauceName))
                return itemSlot;

        return null;
    }


}
