import java.util.ArrayList;
import java.util.LinkedHashMap;

/**
 * The RegularVendingMachine class represents a real world object of regular vending machine that
 * allows users to register items, sell item, purchase items, and view transaction summaries.
 */
public class RegularVendingMachine {

    /**
     * The name of the vending machine.
     */
    protected final String VENDINGMACHINENAME;

    /**
     * An array of ItemSlot objects representing the slots in the vending machine.
     */
    protected ItemSlot[] slot;

    /**
     * The vault that stores the cash collected from the vending machine.
     */
    protected CashVault vault;

    /**
     * The stash that temporarily holds the cash inserted by the user.
     */
    protected Stash stash;
    protected LinkedHashMap<Integer, ArrayList<Money>> changeCount;

    /**
     * Constructs a VendingMachine object with the specified name, slot count, and
     * slot capacity.
     *
     * @param vendingMachineName The name of the vending machine.
     * @param slotCount          The number of slots in the vending machine.
     * @param slotCapacity       The capacity of each slot in the vending machine.
     */
    public RegularVendingMachine(String vendingMachineName, int slotCount, int slotCapacity) {
        this.VENDINGMACHINENAME = vendingMachineName;

        slot = new ItemSlot[slotCount];
        for (int i = 0; i < slotCount; i++) {
            slot[i] = new ItemSlot(slotCapacity);
        }

        vault = new CashVault();
        stash = new Stash();
    }

    /**
     * Registers a new item in the vending machine.
     *
     * @param itemName    The name of the item to be registered.
     * @param price       The price of the item.
     * @param calories    The calorie content of the item.
     * @param description The description of the item.
     * @param quantity    The initial quantity of the item to be added to the vending machine.
     * @return true if the item was successfully registered and added to the vending machine,
     *         false if all slots in the vending machine are already occupied.
     */

    public boolean registerItem(String itemName, int price, float calories, String description, int quantity) {
        int emptySlotIndex = -1;

        for (int i = 0; i < slot.length; i++)
            if (slot[i].isEmpty()) {
                emptySlotIndex = i;
                break;
            }
        // Check if slots are already full
        if (emptySlotIndex == -1)
            return false;

        slot[emptySlotIndex].addItem(itemName, price, calories, description, quantity);

        return true;
    }

    /**
     * Processes the checkout of an item from the vending machine.
     *
     * @param slotNum The slot number of the item to check out.
     * @return 0 if the checkout is successful, 1 if the slot number is invalid, 2 if the item is not available,
     *         3 if the user's balance is insufficient to purchase the item, and 4 if there is not enough change
     *         to provide after the purchase.
     */
    public int checkOutItem(int slotNum) {
        int balance = stash.getBalance();

        if (slotNum < 0 || slotNum >= slot.length || slot[slotNum].isEmpty()) {
            return 1; // Invalid slot number
        }

        if (!isItemAvailable(slot[slotNum])) {
            return 2; // Item not available in the slot
        }

        int itemCost = slot[slotNum].getItem().getPrice();

        if (balance < itemCost)
            return 3; // Insufficient balance to purchase the item

        int remainingBalance = balance - itemCost;

        if (isEnoughInStash(itemCost)) {
            slot[slotNum].dispenseItem();
            transferStashToVault(itemCost);
            stash.withdrawEverything();
            return 0; // Checkout successful
        } else if (isEnoughChange(remainingBalance)) {
            slot[slotNum].dispenseItem();
            transferStashToVault(balance);
            changeCount = dispenseChange(remainingBalance);
            stash.withdrawEverything();
            return 0; // Checkout successful
        } else
            return 4; // Not enough change to provide
    }

    /**
     * Updates the quantity of the given item in the vending machine.
     *
     * @param itemToEdit    The item to update the quantity for.
     * @param quantityToAdd The quantity to add to the current item quantity.
     */
    public void updateItemQuantity(String itemToEdit, int quantityToAdd) {
        ItemSlot[] itemSlots = getSlot();

        for (ItemSlot itemSlot : itemSlots)
            if (itemSlot.getItem() != null && itemSlot.getItem().getItemName().equalsIgnoreCase(itemToEdit)) {
                itemSlot.restockItem(quantityToAdd);
                break;
            }
    }

    /**
     * Updates the price of the given item in the vending machine.
     *
     * @param itemToEdit The item to update the price for.
     * @param newPrice   The new price of the item.
     */
    public void updateItemPrice(String itemToEdit, int newPrice) {
        ItemSlot[] itemSlots = getSlot();

        for (ItemSlot itemSlot : itemSlots) {
            Item item = itemSlot.getItem();
            if (item != null && item.getItemName().equals(itemToEdit)) {
                item.setNewPrice(newPrice);
                break;
            }
        }
    }

    /**
     * Empties the slot containing the specified item from the vending machine.
     *
     * @param itemToEdit The item to remove from the slot.
     */
    public void emptySlot(String itemToEdit) {
        ItemSlot[] itemSlots = getSlot();

        for (ItemSlot itemSlot : itemSlots) {
            Item item = itemSlot.getItem();
            if (item != null && item.getItemName().equalsIgnoreCase(itemToEdit)) {
                itemSlot.deleteItem(); // Call the deleteItem method to remove all items from the slot containing the itemToEdit.
                break;
            }
        }
    }

    /**
     * Dispenses change to the customer based on the given change amount.
     *
     * @param changeAmount The amount of change to be dispensed.
     */
    protected LinkedHashMap<Integer, ArrayList<Money>> dispenseChange(int changeAmount) {
        int[] denominations = { 1000, 500, 200, 100, 50, 20, 10, 5, 1 };
        changeCount = new LinkedHashMap<>();
        changeCount.put(1, new ArrayList<>());
        changeCount.put(5, new ArrayList<>());
        changeCount.put(10, new ArrayList<>());
        changeCount.put(20, new ArrayList<>());
        changeCount.put(50, new ArrayList<>());
        changeCount.put(100, new ArrayList<>());
        changeCount.put(200, new ArrayList<>());
        changeCount.put(500, new ArrayList<>());
        changeCount.put(1000, new ArrayList<>());

        for (int denomination : denominations) {
            int quantity = vault.getQuantityByDenomination(denomination);
            while (quantity > 0 && changeAmount >= denomination) {
                Money money = new Money(denomination);
                changeCount.get(denomination).add(money);
                changeAmount -= denomination;
                vault.withdraw(denomination);
                stash.deposit(denomination);
                quantity--;
            }
        }

        return changeCount;
    }

    /**
     * Transfers the cash from the stash to the vault and returns the total amount transferred.
     *
     * @param amountPayable The total amount of cash to be transferred from the stash to the vault.
     */
    protected void transferStashToVault(int amountPayable) {
        int[] denominations = { 1000, 500, 200, 100, 50, 20, 10, 5, 1 };

        for (int denomination : denominations) {
            int quantity = stash.getQuantityByDenomination(denomination);
            while (quantity > 0 && amountPayable >= denomination) {
                stash.withdraw(denomination);
                vault.deposit(denomination);
                amountPayable -= denomination;
                quantity--;
            }
            if (amountPayable == 0)
                break;
        }
    }

    /**
     * Displays the transaction summary of the vending machine.
     *
     * @return An {@link ArrayList} of {@link SalesInfo} objects representing the total sales information
     *          for all items in the vending machine. Each SalesInfo object contains details about an item's sales,
     *         including its name, initial stock, current stock, quantity sold, unit price, and total earnings.
     */
    public ArrayList<SalesInfo> transactionSummary() {
        TransactionSummary transactionSummary = new TransactionSummary(this);
        return transactionSummary.getTotalSales();
    }

    /**
     * Checks if the given item name is unique in the vending machine.
     *
     * @param itemName The name of the item to check for uniqueness.
     * @return {@code true} if the item name is unique (i.e., no item with the same name exists),
     *         {@code false} otherwise.
     */
    public boolean isItemUnique(String itemName) {
        for (ItemSlot itemSlot : slot) {
            Item item = itemSlot.getItem();
            if (item != null && item.getItemName().equalsIgnoreCase(itemName)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks if an item is available in the given item slot.
     *
     * @param itemSlot The item slot to check.
     * @return True if the item slot is not empty (i.e., the item is available);
     *         false otherwise.
     */
    protected boolean isItemAvailable(ItemSlot itemSlot) {
        return !itemSlot.isEmpty();
    }

    /**
     * Checks if there is enough change in the vending machine to provide the
     * specified change amount.
     *
     * @param changeAmount The amount of change to be provided.
     * @return True if there is enough change in the vending machine to provide the
     *         specified amount; false otherwise.
     */
    protected boolean isEnoughChange(int changeAmount) {
        int[] denominations = { 1000, 500, 200, 100, 50, 20, 10, 5, 1 };
        CashVault vaultTemp = getVault();

        for (int denomination : denominations) {
            int quantity = vaultTemp.getQuantityByDenomination(denomination);
            while (quantity > 0 && changeAmount >= denomination) {
                changeAmount -= denomination;
                quantity--;
            }
        }

        return changeAmount == 0;
    }

    /**
     * Checks if the stash contains enough cash to pay the specified item cost.
     *
     * @param itemCost The cost of the item to be purchased.
     *
     * @return True if there is enough cash in the stash to pay the item cost, false otherwise.
     */
    protected boolean isEnoughInStash(int itemCost) {
        int[] denominations = { 1000, 500, 200, 100, 50, 20, 10, 5, 1 };
        Stash stash = getStash();

        for (int denomination : denominations) {
            int quantity = stash.getQuantityByDenomination(denomination);
            while (quantity > 0 && itemCost >= denomination) {
                itemCost -= denomination;
                quantity--;
            }
        }

        return itemCost == 0;
    }

    /**
     * Returns the name of the vending machine.
     *
     * @return The name of the vending machine.
     */
    public String getVendingMachineName() {
        return VENDINGMACHINENAME;
    }

    /**
     * Returns an array of ItemSlot objects representing the slots in the vending
     * machine.
     *
     * @return An array of ItemSlot objects.
     */
    public ItemSlot[] getSlot() {
        return slot;
    }

    /**
     * Returns the cash vault of the vending machine.
     *
     * @return The cash vault object.
     */
    public CashVault getVault() {
        return vault;
    }

    /**
     * Returns the stash vault of the vending machine.
     *
     * @return The stash vault object.
     */
    public Stash getStash() {
        return stash;
    }


    /**
     * Returns the ItemSlot object corresponding to the given item name.
     *
     * @param itemName The name of the item to find the slot for.
     * @return The ItemSlot object containing the item with the given name.
     */
    public ItemSlot getItemSlotByItemName(String itemName) {
        for (ItemSlot itemSlot : slot) {
            if (itemSlot != null && itemSlot.getItem() != null
                    && itemSlot.getItem().getItemName().equalsIgnoreCase(itemName)) {
                return itemSlot;
            }
        }
        return null;
    }

    public LinkedHashMap<Integer, ArrayList<Money>> getChangeCount(){
        return changeCount;
    }
}
