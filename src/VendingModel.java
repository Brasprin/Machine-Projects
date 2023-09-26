import java.util.ArrayList;

/**
 * A class representing the vending machine model. It manages the creation and
 * selection of regular and special vending machines.
 */
public class VendingModel {

    /**
     * A list of regular vending machines.
     */
    private ArrayList<RegularVendingMachine> regularVendingMachines;

    /**
     * A list of special vending machines.
     */
    private ArrayList<SpecialVendingMachine> specialVendingMachines;

    /**
     * A flag to indicate if the selected vending machine is a special vending
     * machine.
     */
    private boolean isSpecialVending;

    /**
     * The index of the selected vending machine in the corresponding list (regular
     * or special).
     */
    private int selectedVendingIndex;

    /**
     * Constructs a new VendingModel object with empty lists of regular and special
     * vending machines.
     */
    public VendingModel() {
        regularVendingMachines = new ArrayList<>();
        specialVendingMachines = new ArrayList<>();
    }

    /**
     * Creates a new regular vending machine and adds it to the list of regular
     * vending machines.
     *
     * @param vendingMachineName The name of the regular vending machine.
     * @param slotCount          The number of slots in the regular vending machine.
     * @param slotCapacity       The capacity of each slot in the regular vending
     *                           machine.
     */
    public void createRegularVendingMachine(String vendingMachineName, int slotCount, int slotCapacity) {
        RegularVendingMachine regularVendingMachine = new RegularVendingMachine(vendingMachineName, slotCount, slotCapacity);
        regularVendingMachines.add(regularVendingMachine);
    }

    /**
     * Creates a new special vending machine and adds it to the list of special
     * vending machines.
     *
     * @param vendingMachineName The name of the special vending machine.
     * @param slotCapacity       The capacity of each slot in the special vending
     *                           machine.
     * @param sauceSlotCapacity  The capacity of the sauce slot in the special
     *                           vending machine.
     */
    public void createSpecialVendingMachine(String vendingMachineName, int slotCapacity, int sauceSlotCapacity){
        SpecialVendingMachine specialVendingMachine =
                new SpecialVendingMachine(vendingMachineName, slotCapacity, sauceSlotCapacity);
        specialVendingMachines.add(specialVendingMachine);
    }

    /**
     * Selects a vending machine based on the given vending index.
     *
     * @param vendingIndex The index of the vending machine to be selected.
     * @return True if the vending machine is successfully selected; false if the
     *         vending index is invalid.
     */
    public boolean selectVendingMachine(int vendingIndex) {
        int regularVendingSize = regularVendingMachines.size();
        int specialVendingSize = specialVendingMachines.size();

        if (vendingIndex >= 0 && vendingIndex < regularVendingSize) {
            isSpecialVending = false;
            selectedVendingIndex = vendingIndex;
        } else if (vendingIndex >= regularVendingSize && vendingIndex < (regularVendingSize + specialVendingSize)) {
            isSpecialVending = true;
            selectedVendingIndex = vendingIndex - regularVendingSize;
        } else {
            // Invalid vending index, reset the current vending machine
            isSpecialVending = false;
            selectedVendingIndex = -1;
            return false;
        }

        return true;
    }

    /**
     * Registers a new item in the selected vending machine.
     *
     * @param itemName    The name of the item to be registered.
     * @param price       The price of the item.
     * @param calories    The calorie content of the item.
     * @param description The description of the item.
     * @param quantity    The initial quantity of the item to be added to the
     *                    vending machine.
     * @return True if the item is successfully registered; false otherwise.
     */
    public boolean registerItem(String itemName, int price, float calories, String description, int quantity) {
        if (!isSpecialVending && regularVendingMachines.get(selectedVendingIndex).registerItem(itemName, price, calories, description, quantity))
            return true;
        else
            return isSpecialVending && specialVendingMachines.get(selectedVendingIndex).registerItem(itemName, price, calories, description, quantity);
    }

    /**
     * Registers a new sauce in the selected special vending machine.
     *
     * @param itemName    The name of the sauce to be registered.
     * @param price       The price of the sauce.
     * @param calories    The calorie content of the sauce.
     * @param description The description of the sauce.
     * @param quantity    The initial quantity of the sauce to be added to the
     *                    special vending machine.
     * @return True if the sauce is successfully registered; false otherwise.
     */
    public boolean registerSauce(String itemName, int price, float calories, String description, int quantity){
        return specialVendingMachines.get(selectedVendingIndex).registerSauce(itemName, price, calories, description, quantity);
    }

    /**
     * Checks if an item with the given item name exists in the selected vending
     * machine.
     *
     * @param itemNameToEdit The name of the item to check.
     * @return True if the item with the given name exists in the vending machine;
     *         false otherwise.
     */
    public boolean isValidItem(String itemNameToEdit) {
        ItemSlot [] itemSlots;

        if (!isSpecialVending)
            itemSlots =  regularVendingMachines.get(selectedVendingIndex).getSlot();
        else
            itemSlots =  specialVendingMachines.get(selectedVendingIndex).getSlot();
        for (ItemSlot itemSlot : itemSlots)
            if (itemSlot.getItem() != null && itemSlot.getItem().getItemName().equalsIgnoreCase(itemNameToEdit))
                return true;

        return false;
    }

    /**
     * Checks if a sauce with the given sauce name exists in the selected special
     * vending machine.
     *
     * @param sauceNameToEdit The name of the sauce to check.
     * @return True if the sauce with the given name exists in the special vending
     *         machine; false otherwise.
     */
    public boolean isValidSauce(String sauceNameToEdit){
        ItemSlot[] sauceSlots = specialVendingMachines.get(selectedVendingIndex).getSauceSlot();

        for (ItemSlot sauceSlot : sauceSlots)
            if (sauceSlot.getItem() != null && sauceSlot.getItem().getItemName().equalsIgnoreCase(sauceNameToEdit))
                return true;

        return false;

    }

    /**
     * Adds the given quantity to the item in the selected vending machine, if
     * valid.
     *
     * @param itemToEdit The item to which the quantity should be added.
     * @param quantityToAdd   The quantity to be added.
     * @return True if the quantity is successfully added; false if the item is not
     *         found or the quantity is invalid.
     */
    public boolean addItemQuantity(String itemToEdit, int quantityToAdd) {
        ItemSlot [] itemSlots;

        if (!isSpecialVending)
            itemSlots =  regularVendingMachines.get(selectedVendingIndex).getSlot();
        else
            itemSlots =  specialVendingMachines.get(selectedVendingIndex).getSlot();

        for (ItemSlot itemSlot : itemSlots)
            if (itemSlot.getItem() != null && itemSlot.getItem().getItemName().equalsIgnoreCase(itemToEdit) && itemSlot.isValidQuantity(quantityToAdd)) {
                if (!isSpecialVending)
                    regularVendingMachines.get(selectedVendingIndex).updateItemQuantity(itemToEdit, quantityToAdd);
                else
                    specialVendingMachines.get(selectedVendingIndex).updateItemQuantity(itemToEdit, quantityToAdd);
                return true;
            }

        return false;
    }

    /**
     * Sets the new price for the given item in the selected vending machine.
     *
     * @param itemToEdit The item for which the price should be updated.
     * @param newPrice   The new price for the item.
     */
    public void setNewPrice(String itemToEdit, int newPrice){
        ItemSlot [] itemSlots;

        if (!isSpecialVending)
            itemSlots =  regularVendingMachines.get(selectedVendingIndex).getSlot();
        else
            itemSlots =  specialVendingMachines.get(selectedVendingIndex).getSlot();

        for (ItemSlot itemSlot : itemSlots)
            if (itemSlot.getItem() != null && itemSlot.getItem().getItemName().equalsIgnoreCase(itemToEdit)) {
                if (!isSpecialVending)
                    regularVendingMachines.get(selectedVendingIndex).updateItemPrice(itemToEdit, newPrice);
                else
                    specialVendingMachines.get(selectedVendingIndex).updateItemPrice(itemToEdit, newPrice);
            }
    }

    public void addSauceQuantity(String sauceToEdit, int quantityToAdd){
        ItemSlot [] itemSlots;
        itemSlots =  specialVendingMachines.get(selectedVendingIndex).getSauceSlot();

        for (ItemSlot sauceSlot : itemSlots)
            if (sauceSlot.getItem() != null && sauceSlot.getItem().getItemName().equalsIgnoreCase(sauceToEdit))
                specialVendingMachines.get(selectedVendingIndex).updateSauceQuantity(sauceToEdit, quantityToAdd);
    }
    public void setNewSaucePrice(String sauceToEdit, int newPrice){
        ItemSlot [] itemSlots;
        itemSlots =  specialVendingMachines.get(selectedVendingIndex).getSauceSlot();

        for (ItemSlot sauceSlot : itemSlots)
            if (sauceSlot.getItem() != null && sauceSlot.getItem().getItemName().equalsIgnoreCase(sauceToEdit))
                    specialVendingMachines.get(selectedVendingIndex).updateSaucePrice(sauceToEdit, newPrice);

    }
    /**
     * Empties the slot containing the specified item from the selected vending
     * machine.
     *
     * @param itemNameToEmpty The item to be removed from the slot.
     */
    public void emptySlot(String itemNameToEmpty) {
        ItemSlot[] itemSlots;

        if (!isSpecialVending)
            itemSlots = regularVendingMachines.get(selectedVendingIndex).getSlot();
        else
            itemSlots = specialVendingMachines.get(selectedVendingIndex).getSlot();

        for (ItemSlot itemSlot : itemSlots) {
            if (itemSlot.getItem() != null && itemSlot.getItem().getItemName().equalsIgnoreCase(itemNameToEmpty)) {
                if (!isSpecialVending)
                    regularVendingMachines.get(selectedVendingIndex).emptySlot(itemNameToEmpty);
                else
                    specialVendingMachines.get(selectedVendingIndex).emptySlot(itemNameToEmpty);
                break;
            }
        }
    }

    public void emptySauceSlot(String sauceNameToEmpty){
        ItemSlot[] sauceSlots = specialVendingMachines.get(selectedVendingIndex).getSauceSlot();
        for (ItemSlot itemSlot : sauceSlots)
            if (itemSlot.getItem() != null && itemSlot.getItem().getItemName().equalsIgnoreCase(sauceNameToEmpty)) {
                specialVendingMachines.get(selectedVendingIndex).emptySauceSlot(sauceNameToEmpty);
                break;
            }
    }

    /**
     * Checks out an item from the selected vending machine.
     *
     * @param slotNum The slot number from which the item should be checked out.
     * @return An integer code indicating the result of the checkout operation. (0:
     *         Success, 1: Invalid slot number, 2: Item not available,
     *         3: Insufficient balance, 4: Unable to provide change)
     */
    public int checkoutItem(int slotNum){
        return regularVendingMachines.get(selectedVendingIndex).checkOutItem(slotNum);
    }

    /**
     * Checks out the made product from the selected special vending machine.
     *
     * @return An integer code indicating the result of the checkout operation. (0:
     *         Success, 1: No made product available, 2: Insufficient balance,
     *         3: Unable to provide change)
     */
    public int checkOutMadeProduct() {
        return specialVendingMachines.get(selectedVendingIndex).checkOutMadeProduct();
    }

    /**
     * Updates the cash vault of the selected vending machine by depositing the
     * specified cash amount.
     *
     * @param cashToAdd The amount of cash to be deposited into the cash vault.
     * @return The updated balance of the cash vault after the deposit.
     */
    public int updateCashVaultMoney(int cashToAdd){
        if (!isSpecialVending) {
            regularVendingMachines.get(selectedVendingIndex).getVault().deposit(cashToAdd);
            return regularVendingMachines.get(selectedVendingIndex).getVault().getBalance();
        }
        else {
            specialVendingMachines.get(selectedVendingIndex).getVault().deposit(cashToAdd);
            return specialVendingMachines.get(selectedVendingIndex).getVault().getBalance();
        }
    }

    /**
     * Withdraws cash from the cash vault of the selected vending machine.
     *
     * @param cashToWithdraw The amount of cash to be withdrawn from the cash vault.
     * @return The updated balance of the cash vault after the withdrawal.
     */
    public int withdrawCashVaultMoney(int cashToWithdraw){
        if (!isSpecialVending) {
            regularVendingMachines.get(selectedVendingIndex).getVault().withdraw(cashToWithdraw);
            return regularVendingMachines.get(selectedVendingIndex).getVault().getBalance();
        }
        else {
            specialVendingMachines.get(selectedVendingIndex).getVault().withdraw(cashToWithdraw);
            return specialVendingMachines.get(selectedVendingIndex).getVault().getBalance();
        }
    }

    /**
     * Updates the stash of the selected vending machine by depositing the specified
     * cash amount.
     *
     * @param cashToAdd The amount of cash to be deposited into the stash.
     * @return The updated balance of the stash after the deposit.
     */
    public float updateStashMoney(int cashToAdd){
        if (!isSpecialVending) {
            regularVendingMachines.get(selectedVendingIndex).getStash().deposit(cashToAdd);
            return regularVendingMachines.get(selectedVendingIndex).getStash().getBalance();
        }
        else {
            specialVendingMachines.get(selectedVendingIndex).getStash().deposit(cashToAdd);
            return specialVendingMachines.get(selectedVendingIndex).getStash().getBalance();
        }
    }

    /**
     * Dispenses all the cash from the stash of the selected vending machine.
     *
     * @return True if the cash is successfully dispensed; false if the stash is
     *         empty.
     */
    public boolean dispenseStashMoney(){
        if (!isSpecialVending)
            return regularVendingMachines.get(selectedVendingIndex).getStash().withdrawEverything();
        else
            return specialVendingMachines.get(selectedVendingIndex).getStash().withdrawEverything();
    }

    /**
     * Adds the item from the specified slot to the cart of the selected special
     * vending machine.
     *
     * @param slotNum The slot number from which the item should be added to the
     *                cart.
     * @return True if the item is successfully added to the cart; false otherwise.
     */
    public boolean addItemToCart(int slotNum){
        return specialVendingMachines.get(selectedVendingIndex).addItemToQueue(slotNum);
    }

    /**
     * Adds the sauce from the specified slot to the cart of the selected special
     * vending machine.
     *
     * @param slotNum The slot number from which the sauce should be added to the
     *                cart.
     * @return True if the sauce is successfully added to the cart; false otherwise.
     */
    public boolean addSauceToCart(int slotNum){
        return specialVendingMachines.get(selectedVendingIndex).addSauceToQueue(slotNum);
    }

    /**
     * Retrieves the list of regular vending machines.
     *
     * @return An ArrayList containing all the regular vending machines.
     */
    public ArrayList<RegularVendingMachine> getRegularVendingMachines() {
        return regularVendingMachines;
    }

    /**
     * Retrieves the list of special vending machines.
     *
     * @return An ArrayList containing all the special vending machines.
     */
    public ArrayList<SpecialVendingMachine> getSpecialVendingMachines() {
        return specialVendingMachines;
    }

    /**
     * Retrieves the current vending machine, either regular or special, based on
     * the selection.
     *
     * @return The current vending machine.
     */
    public RegularVendingMachine getCurrentVendingMachine() {
        if (isSpecialVending)
            return specialVendingMachines.get(selectedVendingIndex);
        else
            return regularVendingMachines.get(selectedVendingIndex);
    }

    /**
     * Retrieves the special vending machine for the current selection.
     *
     * @return The special vending machine.
     */
    public SpecialVendingMachine getSpecialVendingMachine(){
        return specialVendingMachines.get(selectedVendingIndex);
    }

    /**
     * Retrieves an array of ItemSlot objects that contain non-null items from the
     * selected vending machine.
     *
     * @return An array of ItemSlot objects containing non-null items.
     */
    public ItemSlot[] getNonNullItem() {
        int nonNullItemCount = 0;
        ItemSlot [] itemSlots;

        if (!isSpecialVending)
            itemSlots =  regularVendingMachines.get(selectedVendingIndex).getSlot();
        else
            itemSlots =  specialVendingMachines.get(selectedVendingIndex).getSlot();

        for (ItemSlot slot : itemSlots)
            if (slot.getItem() != null)
                nonNullItemCount++;

        ItemSlot[] nonNullItemSlots = new ItemSlot[nonNullItemCount]; // New array with the size equal to the number of non-null items

        int index = 0;
        for (ItemSlot slot : itemSlots)
            if (slot.getItem() != null)
                nonNullItemSlots[index++] = slot;          // Copy non-null items to the new array

        return nonNullItemSlots;
    }

    /**
     * Retrieves an array of ItemSlot objects that contain non-null sauces from the
     * selected special vending machine.
     *
     * @return An array of ItemSlot objects containing non-null sauces.
     */
    public ItemSlot[] getNonNullSauce(){
        int nonNullSauceCount = 0;
        ItemSlot [] sauceSlot;

        sauceSlot = specialVendingMachines.get(selectedVendingIndex).getSauceSlot();

        for (ItemSlot slot : sauceSlot)
            if (slot.getItem() != null)
                nonNullSauceCount++;

        ItemSlot[] nonNullSauceSlots = new ItemSlot[nonNullSauceCount];

        int index = 0;
        for (ItemSlot slot : sauceSlot)
            if (slot.getItem() != null)
                nonNullSauceSlots[index++] = slot;          // Copy non-null items to the new array

        return nonNullSauceSlots;
    }

    /**
     * Retrieves the current balance of the cash vault in the selected vending
     * machine.
     *
     * @return The current balance of the cash vault.
     */
    public float getVaultBalance() {
        if (!isSpecialVending)
            return regularVendingMachines.get(selectedVendingIndex).getVault().getBalance();
        else
            return specialVendingMachines.get(selectedVendingIndex).getVault().getBalance();
    }

    /**
     * Retrieves the stash of the selected vending machine.
     *
     * @return The stash of the vending machine.
     */
    public Stash getStash() {
        if (!isSpecialVending)
            return regularVendingMachines.get(selectedVendingIndex).getStash();
        else
            return specialVendingMachines.get(selectedVendingIndex).getStash();
    }

    /**
     * Retrieves the transaction summary (sales) for the current vending machine.
     *
     * @return An ArrayList containing the sales information for the vending
     *         machine.
     */
    public ArrayList<SalesInfo> getSales() {
        if (!isSpecialVending)
            return regularVendingMachines.get(selectedVendingIndex).transactionSummary();
        else
            return specialVendingMachines.get(selectedVendingIndex).transactionSummary();
    }

    /**
     * Checks if the selected vending machine is a special vending machine.
     *
     * @return True if the selected vending machine is a special vending machine;
     *         false otherwise.
     */
    public boolean isSpecialVending() {
        return isSpecialVending;
    }

}
