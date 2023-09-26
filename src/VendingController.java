public class VendingController {

    private final VendingView VENDINGVIEW;
    private final VendingModel VENDINGMODEL;
    private ItemSlot selectedItemSlot;
    private boolean isSpecial;

    public VendingController(VendingView vendingView, VendingModel vendingModel) {
        VENDINGVIEW = vendingView;
        VENDINGMODEL = vendingModel;

        VENDINGVIEW.setContinueVendingMachineActionListener(e->{
            VENDINGVIEW.initializeVendingMode();
            setupChooseVendingMode();
        });

    }

    private void setHomeButton() {
        VENDINGVIEW.setHomeVendingButtonListener(e -> {
            VENDINGVIEW.initializeVendingMode();
            setupChooseVendingMode();
        });
    }

    private void setFeatureBackButton() {
        VENDINGVIEW.setFeatureBackButtonListener(e -> {
            VENDINGVIEW.initializeFeature();
            setupFeature();
        });
    }

    private void setRegularMaintenanceFeatureBackButton() {
        VENDINGVIEW.setRegularMaintenanceFeatureBackButton(e -> {
            VENDINGVIEW.initializeRegularMaintenanceFeature();
            setupRegularMaintenanceFeature();
        });
    }

    private void setSpecialMaintenanceFeatureBackButton() {
        VENDINGVIEW.setSpecialMaintenanceFeatureBackButton(e -> {
            VENDINGVIEW.initializeSpecialMaintenanceFeature();
            setupSpecialMaintenanceFeature();
        });
    }
    private void setRegularVendingFeatureBackButton() {
        VENDINGVIEW.setRegularVendingFeatureBackButtonListener(e -> {
            VENDINGVIEW.initializeRegularVendingFeature();
            setupRegularVendingFeature();
        });
    }
    private void setSpecialVendingFeatureBackButton() {
        VENDINGVIEW.setSpecialVendingFeatureBackButtonListener(e -> {
            VENDINGVIEW.initializeSpecialVendingFeature();
            setupSpecialVendingFeature();
        });
    }

    private void setupChooseVendingMode() {
        VENDINGVIEW.setCreateVendingButtonListener(e -> {
            VENDINGVIEW.initializeVendingType();
            setupCreationOfVending();
        });

        VENDINGVIEW.setTestVendingButtonListener(e -> {
            VENDINGVIEW.initializeVendingToTest();
            setupTestVendingNum();
        });

        VENDINGVIEW.setshowVendingButtonListener(e -> {
            if (VENDINGMODEL.getRegularVendingMachines().size() == 0
                    && VENDINGMODEL.getSpecialVendingMachines().size() == 0)
                VENDINGVIEW.showMessageDialog("There is no vending machine available.");
            else
                VENDINGVIEW.initializeShowVending(VENDINGMODEL.getRegularVendingMachines(),
                        VENDINGMODEL.getSpecialVendingMachines());
        });
    }

    public void setupCreationOfVending() {
        VENDINGVIEW.setRegularVendingTypeButtonListener(e -> {
            VENDINGVIEW.initializeCreateRegularVending();
            isSpecial = false;
            setupRegularVendingInfo();
        });

        VENDINGVIEW.setSpecialVendingTypeButtonListener(e -> {
            VENDINGVIEW.initializeCreateSpecialVending();
            isSpecial = true;
            setupSpecialVendingInfo();
        });


        VENDINGVIEW.setCreateVendingBackButtonListener(e -> {
            VENDINGVIEW.initializeVendingType();
            setupCreationOfVending();
        });

        setHomeButton();
    }

    private void setupRegularVendingInfo(){
        VENDINGVIEW.setVendingRegularInfoButtonListener(e -> {
            String vendingMachineName = VENDINGVIEW.getRegularVendingNameTextField();
            int slotCount = 0;
            int slotCapacity = 0;
            boolean isValidVending = true;

            if (vendingMachineName.trim().isEmpty()) {
                VENDINGVIEW.showErrorDialog("Vending name cannot be blank.");
                isValidVending = false;
            }
            try {
                slotCount = Integer.parseInt(VENDINGVIEW.getRegularSlotCountTextField());
                if (slotCount < 8) {
                    VENDINGVIEW.showErrorDialog("Slot count cannot be less than 8.");
                    isValidVending = false;
                }
            } catch (NumberFormatException ex) {
                VENDINGVIEW.showErrorDialog("Invalid slot count input.");
                isValidVending = false;
            }

            try {
                slotCapacity = Integer.parseInt(VENDINGVIEW.getRegularSlotCapacityTextField());
                if (slotCapacity < 10) {
                    VENDINGVIEW.showErrorDialog("Slot capacity cannot be less than 10.");
                    isValidVending = false;
                }
            } catch (NumberFormatException ex) {
                VENDINGVIEW.showErrorDialog("Invalid slot capacity input.");
                isValidVending = false;
            }

            if (isValidVending) {
                VENDINGVIEW.showCongratulationsDialog("You've successfully created a regular vending machine!");
                VENDINGMODEL.createRegularVendingMachine(vendingMachineName, slotCount, slotCapacity);
            }
            VENDINGVIEW.initializeVendingMode();
            setupChooseVendingMode();
        });
    }
    private void setupSpecialVendingInfo() {
        VENDINGVIEW.setVendingSpecialInfoButtonListener(e -> {
            String vendingMachineName = VENDINGVIEW.getSpecialVendingNameTextField();
            int slotCapacity = 0;
            int slotSauceCapacity = 0;
            boolean isValidVending = true;

            if (vendingMachineName.trim().isEmpty()) {
                VENDINGVIEW.showErrorDialog("Vending name cannot be blank.");
                isValidVending = false;
            }
            try {
                slotCapacity = Integer.parseInt(VENDINGVIEW.getSpecialSlotCapacityTextField());
                if (slotCapacity < 10) {
                    VENDINGVIEW.showErrorDialog("Slot capacity cannot be less than 10.");
                    isValidVending = false;
                }
            } catch (NumberFormatException ex) {
                VENDINGVIEW.showErrorDialog("Invalid slot capacity input.");
                isValidVending = false;
            }

            try {
                slotSauceCapacity = Integer.parseInt(VENDINGVIEW.getSpecialSlotSauceCapacityTextField());
                if (slotSauceCapacity < 0) {
                    VENDINGVIEW.showErrorDialog("Sauce slot capacity cannot be less than 0.");
                    isValidVending = false;
                }
            } catch (NumberFormatException ex) {
                VENDINGVIEW.showErrorDialog("Invalid sauce slot capacity input.");
                isValidVending = false;
            }

            if (isValidVending) {
                VENDINGVIEW.showCongratulationsDialog("You've successfully created a special vending machine!");
                VENDINGMODEL.createSpecialVendingMachine(vendingMachineName, slotCapacity, slotSauceCapacity);
            }
            VENDINGVIEW.initializeVendingMode();
            setupChooseVendingMode();
        });
    }

    private void setupTestVendingNum() {
        VENDINGVIEW.setTestVendingNumButtonListener(e -> {
            try {
                int vendingNum = Integer.parseInt(VENDINGVIEW.getVendingNumTextField());
                boolean isValid = VENDINGMODEL.selectVendingMachine(vendingNum - 1);
                if (isValid) {
                    VENDINGVIEW.initializeFeature();
                    setupFeature();
                    isSpecial = VENDINGMODEL.isSpecialVending(); // Get the vending type of vending to test.
                } else {
                    VENDINGVIEW.showWarningDialog("Vending Machine Number " + vendingNum + " Not Found.");
                    VENDINGVIEW.initializeVendingMode();
                    setupChooseVendingMode();
                }
            } catch (NumberFormatException ex) {
                VENDINGVIEW.showErrorDialog("Invalid input");
                VENDINGVIEW.initializeVendingMode();
                setupChooseVendingMode();
            }

        });
        setHomeButton();
    }

    private void setupFeature() {
        VENDINGVIEW.setMaintenanceFeatureButtonListener(e -> {
            if (isSpecial) {
                VENDINGVIEW.initializeSpecialMaintenanceFeature();
                setupSpecialMaintenanceFeature();
            }
            else {
                VENDINGVIEW.initializeRegularMaintenanceFeature();
                setupRegularMaintenanceFeature();
            }
        });

        VENDINGVIEW.setVendingFeatureButtonListener(e -> {
            if (isSpecial) {
                VENDINGVIEW.initializeSpecialVendingFeature();
                setupSpecialVendingFeature();
            }
            else {
                VENDINGVIEW.initializeRegularVendingFeature();
                setupRegularVendingFeature();
            }
        });

        setHomeButton();
    }

    private void setupMaintenanceFeature(){
        VENDINGVIEW.setDisplayItemInSlotButtonListener(e -> setupDisplayItemInSlotButton());

        VENDINGVIEW.setDisplayVaultCashButtonListener(
                e -> VENDINGVIEW.initializeShowVault(VENDINGMODEL.getCurrentVendingMachine(), false));

        VENDINGVIEW.setReplenishVaultButtonListener(e -> setupReplenishButton());

        VENDINGVIEW.setTransactionSummaryButtonListener(e -> VENDINGVIEW.showTotalSales(VENDINGMODEL.getSales()));

        VENDINGVIEW.setCollectVaultMoneyButtonListener(e -> setupCollectVaultMoneyButton());
    }
    private void setupRegularMaintenanceFeature() {
        setupMaintenanceFeature();

        VENDINGVIEW.setRegisterRegularItemButtonListener(e -> {
            VENDINGVIEW.initializeRegisterRegularItem();
            setupRegisterItemButtonRegular();
        });

        VENDINGVIEW.setEditRegularItemButtonListener(e -> {
            VENDINGVIEW.initializeNameToEditItemRegular();
            setupEditItemButtonRegular();
        });

        setFeatureBackButton();
        setRegularMaintenanceFeatureBackButton();
    }

    private void setupSpecialMaintenanceFeature() {
        setupMaintenanceFeature();

        VENDINGVIEW.setRegisterSpecialItemButtonListener(e -> {
            VENDINGVIEW.initializeRegisterSpecialItem();
            setupRegisterItemButtonSpecial();
        });

        VENDINGVIEW.setEditSpecialItemButtonListener(e -> {
            VENDINGVIEW.initializeNameToEditItemSpecial();
            setupEditItemButtonSpecial();
        });

        VENDINGVIEW.registerSauceButtonListener(e->{
            VENDINGVIEW.initializeRegisterSauce();
            setupRegisterSauceButton();

        });
        VENDINGVIEW.setEditSauceButtonListener(e -> {
            VENDINGVIEW.initializeSauceNameToEditItemSpecial();
            setupEditSauceItemInSlotButton();
        });

        VENDINGVIEW.setRefillYoghurtButtonListener(e->{
            VENDINGVIEW.showCongratulationsDialog("Yoghurt tank filled successfully");
            VENDINGMODEL.getSpecialVendingMachine().refillYoghurtTank();
        });

        VENDINGVIEW.setShowYoghurtQuantityButtonListener(e->{
            int currentStock = VENDINGMODEL.getSpecialVendingMachine().getYoghurtSlot().getCurrentStock();
            VENDINGVIEW.showMessageDialog("Current Yoghurt Stock: " + currentStock);
        });
        VENDINGVIEW.setDisplaySauceInSlotButtonListener(e-> setupDisplaySauceInSlotButton());
        setFeatureBackButton();
        setSpecialMaintenanceFeatureBackButton();
    }

    private void setupRegisterItemButtonRegular(){
        VENDINGVIEW.setRegisterItemInfoButtonListener(e1 -> {
            String itemName = VENDINGVIEW.getItemNameTextField();
            int itemPrice;
            float itemCalories;
            String itemDescription = VENDINGVIEW.getItemDescriptionTextField();
            int itemQuantity;
            boolean isValidItemName = !itemName.trim().isEmpty();

            if (isValidItemName) {
                try {
                    itemPrice = Integer.parseInt(VENDINGVIEW.getItemPriceTextField());
                    itemCalories = Float.parseFloat(VENDINGVIEW.getItemCaloriesTextField());
                    itemQuantity = Integer.parseInt(VENDINGVIEW.getItemQuantityTextField());
                    if (!VENDINGMODEL.getCurrentVendingMachine().isItemUnique(itemName))
                        VENDINGVIEW.showErrorDialog("Item cannot be registered. Item "
                                + itemName + " is already registered in the slot");
                    else if (itemQuantity <= 0
                            || itemQuantity > VENDINGMODEL.getCurrentVendingMachine().getSlot()[1]
                            .getSlotCapacity())
                        VENDINGVIEW.showErrorDialog(
                                "Invalid Quantity. Please double check the vending machine slot capacity.");
                    else if (VENDINGMODEL.registerItem(itemName, itemPrice, itemCalories, itemDescription,
                            itemQuantity))
                        VENDINGVIEW.showCongratulationsDialog(
                                "You've Successfully registered " + itemName + " with quantity of " + itemQuantity);
                    else
                        VENDINGVIEW.showErrorDialog("Slots are already full. You cannot register this item.");
                } catch (NumberFormatException ex) {
                    VENDINGVIEW.showErrorDialog("Invalid input");
                }
            } else
                VENDINGVIEW.showErrorDialog("Item name cannot be blank.");

            VENDINGVIEW.initializeRegularMaintenanceFeature();
            setupRegularMaintenanceFeature();
            setRegularMaintenanceFeatureBackButton();
        });
    }

    private void setupRegisterItemButtonSpecial(){
        VENDINGVIEW.setRegisterItemInfoButtonListener(e1 -> {
            String itemName = VENDINGVIEW.getItemNameTextField();
            int itemPrice;
            float itemCalories;
            String itemDescription = VENDINGVIEW.getItemDescriptionTextField();
            int itemQuantity;
            boolean isValidItemName = !itemName.trim().isEmpty();

            if (isValidItemName) {
                try {
                    itemPrice = Integer.parseInt(VENDINGVIEW.getItemPriceTextField());
                    itemCalories = Float.parseFloat(VENDINGVIEW.getItemCaloriesTextField());
                    itemQuantity = Integer.parseInt(VENDINGVIEW.getItemQuantityTextField());
                    if (!VENDINGMODEL.getSpecialVendingMachine().isItemUnique(itemName))
                        VENDINGVIEW.showErrorDialog("Item cannot be registered. Item "
                                + itemName + " is already registered in the slot");
                    else if (itemQuantity <= 0
                            || itemQuantity > VENDINGMODEL.getSpecialVendingMachine().getSlot()[1]
                            .getSlotCapacity())
                        VENDINGVIEW.showErrorDialog(
                                "Invalid Quantity. Please double check the vending machine slot capacity.");
                    else if (VENDINGMODEL.registerItem(itemName, itemPrice, itemCalories, itemDescription,
                            itemQuantity))
                        VENDINGVIEW.showCongratulationsDialog(
                                "You've Successfully registered " + itemName + " with quantity of " + itemQuantity);
                    else
                        VENDINGVIEW.showErrorDialog("Slots are already full. You cannot register this item.");
                } catch (NumberFormatException ex) {
                    VENDINGVIEW.showErrorDialog("Invalid input");
                }
            } else
                VENDINGVIEW.showErrorDialog("Item name cannot be blank.");
            VENDINGVIEW.initializeSpecialMaintenanceFeature();
            setupSpecialMaintenanceFeature();
            setSpecialMaintenanceFeatureBackButton();
        });
    }

    private void setupEditItemButtonRegular(){
        VENDINGVIEW.setEnterItemNameToEditRegularButton(e1 -> {
            String itemName = VENDINGVIEW.getItemNameToEditTextField();
            try {
                if (!VENDINGMODEL.isValidItem(itemName)) {
                    VENDINGVIEW.showMessageDialog("There is no item called " + itemName);
                    VENDINGVIEW.initializeRegularMaintenanceFeature();
                    setupRegularMaintenanceFeature();
                }
                else{
                    selectedItemSlot = VENDINGMODEL.getCurrentVendingMachine().getItemSlotByItemName(itemName);
                    VENDINGVIEW.initializeEditItemRegular();
                    setupItemEditModeButton();
                    setHomeButton();
                }
            } catch (NumberFormatException ex) {
                VENDINGVIEW.showWarningDialog("Invalid input");
            } catch (NullPointerException ex) {
                VENDINGVIEW.showMessageDialog("No items available in this vending machine.");
            }
        });
    }

    private void setupEditItemButtonSpecial(){
        VENDINGVIEW.setEnterItemNameToEditSpecialButton(e1 -> {
            String itemName = VENDINGVIEW.getItemNameToEditTextField();
            try {
                if (!VENDINGMODEL.isValidItem(itemName)) {
                    VENDINGVIEW.showMessageDialog("There is no item called " + itemName);
                    VENDINGVIEW.initializeSpecialMaintenanceFeature();
                    setupSpecialMaintenanceFeature();
                }
                else{
                    selectedItemSlot = VENDINGMODEL.getCurrentVendingMachine().getItemSlotByItemName(itemName);
                    VENDINGVIEW.initializeEditItemSpecial();
                    setupItemEditModeButton();
                    setHomeButton();
                }
            } catch (NumberFormatException ex) {
                VENDINGVIEW.showWarningDialog("Invalid input");
            } catch (NullPointerException ex) {
                VENDINGVIEW.showMessageDialog("No items available in this vending machine.");
            }
        });
    }

    private void setupRegisterSauceButton(){
        VENDINGVIEW.setRegisterSauceInfoButtonListener(e1 -> {
            String sauceName = VENDINGVIEW.getSauceNameTextField();
            int saucePrice;
            float sauceCalories;
            String sauceDescription = VENDINGVIEW.getSauceDescriptionTextField();
            int sauceQuantity;
            boolean isValidSauceName = !sauceName.trim().isEmpty();

            if (isValidSauceName) {
                try {
                    saucePrice = Integer.parseInt(VENDINGVIEW.getSaucePriceTextField());
                    sauceCalories = Float.parseFloat(VENDINGVIEW.getSauceCaloriesTextField());
                    sauceQuantity = Integer.parseInt(VENDINGVIEW.getSauceQuantityTextField());
                    if (!VENDINGMODEL.getSpecialVendingMachine().isSauceUnique(sauceName))
                        VENDINGVIEW.showErrorDialog("Sauce cannot be registered. Sauce"
                                + sauceName + " is already registered in the slot");
                    else if (sauceQuantity <= 0
                            || sauceQuantity > VENDINGMODEL.getCurrentVendingMachine().getSlot()[1]
                            .getSlotCapacity())
                        VENDINGVIEW.showErrorDialog(
                                "Invalid Quantity. Please double check the vending machine slot capacity.");
                    else if (VENDINGMODEL.registerSauce(sauceName, saucePrice, sauceCalories, sauceDescription, // change to sauce
                            sauceQuantity))
                        VENDINGVIEW.showCongratulationsDialog(
                                "You've Successfully registered " + sauceName + " with quantity of " + sauceQuantity);
                    else
                        VENDINGVIEW.showErrorDialog("Slots are already full. You cannot register this Sauce.");
                } catch (NumberFormatException ex) {
                    VENDINGVIEW.showErrorDialog("Invalid input");
                }
            } else
                VENDINGVIEW.showErrorDialog("Sauec name cannot be blank.");

            VENDINGVIEW.initializeSpecialMaintenanceFeature();
            setupSpecialMaintenanceFeature();
        });
    }

    public void setupEditSauceItemInSlotButton(){
        VENDINGVIEW.enterSauceNameToEditSpecialEnterButtonListener(e1 -> {
            String sauceName = VENDINGVIEW.getSauceNameToEditTextField();
            try {
                if (VENDINGMODEL.isValidSauce(sauceName) ) {
                    selectedItemSlot = VENDINGMODEL.getSpecialVendingMachine().getSauceSlotBySauceName(sauceName);
                    VENDINGVIEW.initializeEditSauce();
                    setupSauceEditModeButton();
                    setHomeButton();
                } else {
                    VENDINGVIEW.showMessageDialog("There is no sauce called " + sauceName);
                    VENDINGVIEW.initializeSpecialMaintenanceFeature();
                    setupSpecialMaintenanceFeature();
                }
            } catch (NullPointerException ex) {
                VENDINGVIEW.showMessageDialog("No Sauce available in this vending machine.");
                VENDINGVIEW.initializeSpecialMaintenanceFeature();
                setupSpecialMaintenanceFeature();
            }
        });
    }

    private void setupDisplayItemInSlotButton(){
        ItemSlot[] nonNullItems = VENDINGMODEL.getNonNullItem();

        if (nonNullItems.length == 0) {
            VENDINGVIEW.showMessageDialog("No items available in this vending machine.");
            if (isSpecial) {
                VENDINGVIEW.initializeSpecialMaintenanceFeature();
                setupSpecialMaintenanceFeature();
            }
            else {
                VENDINGVIEW.initializeRegularMaintenanceFeature();
                setupRegularMaintenanceFeature();
            }
        } else
            VENDINGVIEW.initializeShowItem(nonNullItems);
    }

    private void setupDisplaySauceInSlotButton() {
        ItemSlot[] nonNullSauce = VENDINGMODEL.getNonNullSauce();

        if (nonNullSauce.length == 0) {
            VENDINGVIEW.showMessageDialog("No sauce available in this vending machine.");
            VENDINGVIEW.initializeSpecialMaintenanceFeature();
            setupSpecialMaintenanceFeature();
        }
        else
            VENDINGVIEW.initializeShowItem(nonNullSauce);

    }

    private void setupReplenishButton() {
        VENDINGVIEW.initializeInsertCash(VENDINGMODEL.getVaultBalance());
        VENDINGVIEW.setDenomination1ButtonListener(
                e1 -> VENDINGVIEW.updateInsertedCashLabel(VENDINGMODEL.updateCashVaultMoney(1)));
        VENDINGVIEW.setDenomination5ButtonListener(
                e2 -> VENDINGVIEW.updateInsertedCashLabel(VENDINGMODEL.updateCashVaultMoney(5)));
        VENDINGVIEW.setDenomination10ButtonListener(
                e3 -> VENDINGVIEW.updateInsertedCashLabel(VENDINGMODEL.updateCashVaultMoney(10)));
        VENDINGVIEW.setDenomination20ButtonListener(
                e4 -> VENDINGVIEW.updateInsertedCashLabel(VENDINGMODEL.updateCashVaultMoney(20)));
        VENDINGVIEW.setDenomination50ButtonListener(
                e5 -> VENDINGVIEW.updateInsertedCashLabel(VENDINGMODEL.updateCashVaultMoney(50)));
        VENDINGVIEW.setDenomination100ButtonListener(
                e6 -> VENDINGVIEW.updateInsertedCashLabel(VENDINGMODEL.updateCashVaultMoney(100)));
        VENDINGVIEW.setDenomination200ButtonListener(
                e7 -> VENDINGVIEW.updateInsertedCashLabel(VENDINGMODEL.updateCashVaultMoney(200)));
        VENDINGVIEW.setDenomination500ButtonListener(
                e8 -> VENDINGVIEW.updateInsertedCashLabel(VENDINGMODEL.updateCashVaultMoney(500)));
        VENDINGVIEW.setDenomination1000ButtonListener(
                e9 -> VENDINGVIEW.updateInsertedCashLabel(VENDINGMODEL.updateCashVaultMoney(1000)));
        VENDINGVIEW.setInsertCashDoneButtonListener(e10 -> {
            if (isSpecial) {
                VENDINGVIEW.initializeSpecialMaintenanceFeature();
                setupSpecialMaintenanceFeature();
            }
            else {
                VENDINGVIEW.initializeRegularMaintenanceFeature();
                setupRegularMaintenanceFeature();
            }
        });
    }

    private void setupCollectVaultMoneyButton() {
        VENDINGVIEW.initializeInsertCash(VENDINGMODEL.getVaultBalance());

        VENDINGVIEW.initializeShowVault(VENDINGMODEL.getCurrentVendingMachine(), false);
        VENDINGVIEW.setDenomination1ButtonListener(e1 -> withdrawAndShowVault(1));
        VENDINGVIEW.setDenomination5ButtonListener(e3 -> withdrawAndShowVault(5));
        VENDINGVIEW.setDenomination10ButtonListener(e5 -> withdrawAndShowVault(10));
        VENDINGVIEW.setDenomination20ButtonListener(e7 -> withdrawAndShowVault(20));
        VENDINGVIEW.setDenomination50ButtonListener(e9 -> withdrawAndShowVault(50));
        VENDINGVIEW.setDenomination100ButtonListener(e11 -> withdrawAndShowVault(100));
        VENDINGVIEW.setDenomination200ButtonListener(e13 -> withdrawAndShowVault(200));
        VENDINGVIEW.setDenomination500ButtonListener(e15 -> withdrawAndShowVault(500));
        VENDINGVIEW.setDenomination1000ButtonListener(e17 -> withdrawAndShowVault(1000));

        VENDINGVIEW.setInsertCashDoneButtonListener(e1 -> {
            if (isSpecial) {
                VENDINGVIEW.initializeSpecialMaintenanceFeature();
                setupSpecialMaintenanceFeature();
            }
            else {
                VENDINGVIEW.initializeRegularMaintenanceFeature();
                setupRegularMaintenanceFeature();
            }
        });
    }

    private void withdrawAndShowVault(int amount) {
        try {
            VENDINGVIEW.updateInsertedCashLabel(VENDINGMODEL.withdrawCashVaultMoney(amount));
            VENDINGVIEW.initializeShowVault(VENDINGMODEL.getCurrentVendingMachine(), false);
        } catch (Exception ex) {
            VENDINGVIEW.showWarningDialog("An error occurred during the cash withdrawal. " +
                    "Please ensure you are withdrawing an amount available in the vault.");
        }
    }

    private void setupItemEditModeButton() {
        VENDINGVIEW.setRestockItemButtonListener(e -> {
            VENDINGVIEW.initializeRestockItem();
            setupRestockAddItem();
        });

        VENDINGVIEW.setSetNewPriceButtonListener(e -> {
            VENDINGVIEW.initializeNewItemPrice();
            setupSetNewItemPriceButton();
        });

        VENDINGVIEW.setEmptySlotButtonListener(e -> {
            VENDINGMODEL.emptySlot(selectedItemSlot.getItem().getItemName());
            VENDINGVIEW.showMessageDialog(
                    "You've successfully emptied the slot. You can now register new item in this slot.");
            if (isSpecial) {
                VENDINGVIEW.initializeSpecialMaintenanceFeature();
                setupSpecialMaintenanceFeature();
            }
            else {
                VENDINGVIEW.initializeRegularMaintenanceFeature();
                setupRegularMaintenanceFeature();
            }
        });

    }

    public void setupSauceEditModeButton(){
        VENDINGVIEW.setRestockSauceButtonListener(e -> {
            VENDINGVIEW.intializeRestockSauce();
            setupRestockAddSauce();
        });

        VENDINGVIEW.setNewPriceSauceButtonListener(e->{
            VENDINGVIEW.initializeNewSaucePrice();
            setupSetNewPriceSauceButton();
        });

        VENDINGVIEW.setEmptySlotSauceButtonListenerActionListener(e -> {
            VENDINGMODEL.emptySauceSlot(selectedItemSlot.getItem().getItemName());
            VENDINGVIEW.showMessageDialog(
                    "You've successfully emptied the slot. You can now register new item in this slot.");
            VENDINGVIEW.initializeSpecialMaintenanceFeature();
            setupSpecialMaintenanceFeature();
        });

    }

    private void setupRestockAddItem(){
        VENDINGVIEW.setRestockAddButtonListener(e1 -> {
            try {
                int quantityToAdd = Integer.parseInt(VENDINGVIEW.getRestockQuantityTextField());
                if (selectedItemSlot.isValidQuantity(quantityToAdd)
                        && VENDINGMODEL.addItemQuantity(selectedItemSlot.getItem().getItemName(), quantityToAdd))
                    VENDINGVIEW.showMessageDialog("You've successfully added " + quantityToAdd + " to item "
                            + selectedItemSlot.getItem().getItemName() + ".");
                else
                    VENDINGVIEW.showWarningDialog("Invalid Capacity! " +
                            "Please double check the slot availability.");
            } catch (NumberFormatException ex) {
                VENDINGVIEW.showErrorDialog("Invalid input");
            } finally {
                if (isSpecial) {
                    VENDINGVIEW.initializeEditItemSpecial();
                    setupEditItemButtonSpecial();
                }
                else {
                    VENDINGVIEW.initializeEditItemRegular();
                    setupEditItemButtonRegular();
                }
                setupItemEditModeButton();
            }
        });
    }

    private void setupSetNewItemPriceButton(){
        VENDINGVIEW.setNewPriceConfirmButtonListener(e1 -> {
            try {
                int newPrice = Integer.parseInt(VENDINGVIEW.getNewPriceTextField());
                VENDINGMODEL.setNewPrice(selectedItemSlot.getItem().getItemName() , newPrice);
                VENDINGVIEW.showMessageDialog("You've successfully changed the item price of " +
                        selectedItemSlot.getItem().getItemName() + " to " + newPrice + ".");
            } catch (NumberFormatException ex) {
                VENDINGVIEW.showErrorDialog("Invalid input");
            } finally {
                if (isSpecial) {
                    VENDINGVIEW.initializeSpecialMaintenanceFeature();
                    setupSpecialMaintenanceFeature();
                }
                else {
                    VENDINGVIEW.initializeRegularMaintenanceFeature();
                    setupRegularMaintenanceFeature();
                }
            }
        });
    }

    private void setupRestockAddSauce(){
        VENDINGVIEW.setRestockAddSauceEnterButtonActionListener(e1 -> {
            try {
                int quantityToAdd = Integer.parseInt(VENDINGVIEW.getQuantityToAddSauceTextField());
                if (selectedItemSlot.isValidQuantity(quantityToAdd)) {
                    VENDINGMODEL.addSauceQuantity(selectedItemSlot.getItem().getItemName(), quantityToAdd);
                    VENDINGVIEW.showMessageDialog("You've successfully added " + quantityToAdd + " to item "
                            + selectedItemSlot.getItem().getItemName() + ".");
                }
                else
                    VENDINGVIEW.showWarningDialog("Invalid Capacity! " +
                            "Please double check the slot availability.");
            } catch (NumberFormatException ex) {
                VENDINGVIEW.showErrorDialog("Invalid input");
            } finally {
                VENDINGVIEW.initializeEditSauce();
                setupSauceEditModeButton();
            }
        });
    }

    private void setupSetNewPriceSauceButton(){
        VENDINGVIEW.setNewSaucePriceConfirmButton(e1 -> {
            try {
                int newPrice = Integer.parseInt(VENDINGVIEW.getNewSaucePriceTextField());  // palitan to ng sauce
                VENDINGMODEL.setNewSaucePrice(selectedItemSlot.getItem().getItemName(), newPrice);
                VENDINGVIEW.showMessageDialog("You've successfully changed the sauce price of " +
                        selectedItemSlot.getItem().getItemName() + " to " + newPrice + ".");
            } catch (NumberFormatException ex) {
                VENDINGVIEW.showErrorDialog("Invalid input");
            } finally {
                VENDINGVIEW.initializeEditSauce();
                setupSauceEditModeButton();
            }
        });

    }
    private void setupVendingFeatureButton(){
        VENDINGVIEW.setInsertCashButtonListener(e -> {
            VENDINGVIEW.initializeInsertCash(VENDINGMODEL.getStash().getBalance());
            setupInsertCashButton();
        });

        VENDINGVIEW.setDisplayItemInSlotButtonListener(e -> {
            ItemSlot[] nonNullItems = VENDINGMODEL.getNonNullItem();

            if (nonNullItems.length == 0) {
                VENDINGVIEW.showMessageDialog("No items available in this vending machine.");
                if(isSpecial)
                    setSpecialVendingFeatureBackButton();
                else
                    setRegularVendingFeatureBackButton();
            } else
                VENDINGVIEW.initializeShowItem(nonNullItems);
        });

        VENDINGVIEW.setDispenseMoneyButtonListener(e -> {
            VENDINGVIEW.initializeShowVault(VENDINGMODEL.getCurrentVendingMachine(), true);
            if (VENDINGMODEL.dispenseStashMoney())
                VENDINGVIEW.showMessageDialog("All money dispensed from stash successfully");
            else
                VENDINGVIEW.showMessageDialog("Stash is empty.");
        });

        setFeatureBackButton();
    }
    private void setupRegularVendingFeature() {
        setupVendingFeatureButton(); // Call Vending Default Maintenance Feature
        VENDINGVIEW.setCheckoutItemButtonListener(e -> {
            VENDINGVIEW.initializeRegularCheckout();
            setupRegularCheckoutButton();
            setRegularVendingFeatureBackButton();
        });
        setRegularVendingFeatureBackButton();
    }

    private void setupSpecialVendingFeature(){
        setupVendingFeatureButton(); // Call Vending Default Maintenance Feature

        VENDINGVIEW.setAddItemToCartButtonListener(e -> {
            VENDINGVIEW.initializeAddItemToCart();
            setupAddItemToCartButton();
        });

        VENDINGVIEW.setAddSauceToCartButtonListener(e -> {
            VENDINGVIEW.initializeAddSauceToCart();
            setupAddSauceToCartButton();
        });

        VENDINGVIEW.setDisplayCartButtonActionListener(e-> VENDINGVIEW.initializeShowCart(VENDINGMODEL.getSpecialVendingMachine().getItemQueue(),
                VENDINGMODEL.getSpecialVendingMachine().getYoghurtSlot()));

        VENDINGVIEW.setEmptyCartButtonActionListener(e->{
            VENDINGVIEW.showMessageDialog("Cart emptied successfully.");
            VENDINGMODEL.getSpecialVendingMachine().emptyQueue();
        });
        VENDINGVIEW.setCheckoutMadeProductButtonListener(e-> setSpecialCheckoutButton());
        VENDINGVIEW.setDisplaySauceInSlotButtonListener(e-> setupDisplaySauceInSlotButton());


        setSpecialVendingFeatureBackButton();
    }

    private void setupAddItemToCartButton(){
        VENDINGVIEW.setAddItemToCartEnterButtonListener(e1 -> {
            int slotNum = Integer.parseInt(VENDINGVIEW.getSlotNumToAddToCartItemTextField()) - 1;
            try {
                if (VENDINGMODEL.addItemToCart(slotNum)) {
                    VENDINGVIEW.showCongratulationsDialog("Successfully added toppings to cart!");
                    VENDINGVIEW.initializeSpecialVendingFeature();
                    setupSpecialVendingFeature();
                }
                else
                    VENDINGVIEW.showErrorDialog("You can only add maximum of 3 items per yoghurt.");
            } catch (NumberFormatException ex) {
                VENDINGVIEW.showErrorDialog("Invalid input.");
            } catch (IndexOutOfBoundsException ex) {
                VENDINGVIEW.showErrorDialog("Invalid slot number.");
            }
            VENDINGVIEW.initializeSpecialVendingFeature();
            setupSpecialVendingFeature();
        });
    }

    private void setupAddSauceToCartButton(){
        VENDINGVIEW.setAddSauceToCartEnterButtonListener(e1 -> {
            int slotNum = Integer.parseInt(VENDINGVIEW.getSlotNumToAddToCartSauceTextField()) - 1;
            try {
                if (VENDINGMODEL.addSauceToCart(slotNum)){
                    VENDINGVIEW.showCongratulationsDialog("Successfully added sauce to cart!");
                    VENDINGVIEW.initializeSpecialVendingFeature();
                    setupSpecialVendingFeature();
                }
                else
                    VENDINGVIEW.showErrorDialog("You can only add maximum of 3 items per yoghurt.");
            } catch (NumberFormatException ex) {
                VENDINGVIEW.showErrorDialog("Invalid input.");
            } catch (IndexOutOfBoundsException ex) {
                VENDINGVIEW.showErrorDialog("Invalid slot number.");
            }
            VENDINGVIEW.initializeSpecialVendingFeature();
            setupSpecialVendingFeature();
        });
    }

    private void setupInsertCashButton(){
        VENDINGVIEW.setDenomination1ButtonListener(
                e1 -> VENDINGVIEW.updateInsertedCashLabel(VENDINGMODEL.updateStashMoney(1)));
        VENDINGVIEW.setDenomination5ButtonListener(
                e2 -> VENDINGVIEW.updateInsertedCashLabel(VENDINGMODEL.updateStashMoney(5)));
        VENDINGVIEW.setDenomination10ButtonListener(
                e3 -> VENDINGVIEW.updateInsertedCashLabel(VENDINGMODEL.updateStashMoney(10)));
        VENDINGVIEW.setDenomination20ButtonListener(
                e4 -> VENDINGVIEW.updateInsertedCashLabel(VENDINGMODEL.updateStashMoney(20)));
        VENDINGVIEW.setDenomination50ButtonListener(
                e5 -> VENDINGVIEW.updateInsertedCashLabel(VENDINGMODEL.updateStashMoney(50)));
        VENDINGVIEW.setDenomination100ButtonListener(
                e6 -> VENDINGVIEW.updateInsertedCashLabel(VENDINGMODEL.updateStashMoney(100)));
        VENDINGVIEW.setDenomination200ButtonListener(
                e7 -> VENDINGVIEW.updateInsertedCashLabel(VENDINGMODEL.updateStashMoney(200)));
        VENDINGVIEW.setDenomination500ButtonListener(
                e8 -> VENDINGVIEW.updateInsertedCashLabel(VENDINGMODEL.updateStashMoney(500)));
        VENDINGVIEW.setDenomination1000ButtonListener(
                e9 -> VENDINGVIEW.updateInsertedCashLabel(VENDINGMODEL.updateStashMoney(1000)));
        VENDINGVIEW.setInsertCashDoneButtonListener(e10 -> {
            if(isSpecial) {
                VENDINGVIEW.initializeSpecialVendingFeature();
                setupSpecialVendingFeature();
            }
            else {
                VENDINGVIEW.initializeRegularVendingFeature();
                setupRegularVendingFeature();
            }
        });
    }

    private void setupRegularCheckoutButton(){
        VENDINGVIEW.setCheckoutEnterButtonListener(e1 -> {
            try {
                int slotNum = Integer.parseInt(VENDINGVIEW.getSlotNumToCheckoutTextField()) - 1;
                Item item = VENDINGMODEL.getNonNullItem()[slotNum].getItem();
                float balance = VENDINGMODEL.getStash().getBalance() - item.getPrice();
                int errorType = VENDINGMODEL.checkoutItem(slotNum);
                if (errorType == 1)
                    VENDINGVIEW.showErrorDialog("Invalid slot number.");
                else if (errorType == 2)
                    VENDINGVIEW.showErrorDialog("Slot item is out of stock.");
                else if (errorType == 3)
                    VENDINGVIEW.showErrorDialog("Insufficient money.");
                else if (errorType == 4)
                    VENDINGVIEW.showErrorDialog("Vending machine doesn't have change.");
                else if (errorType == 0 && balance != 0) {
                    VENDINGVIEW.showMessageDialog("Dispensing: " + item.getItemName() + "\nCalories: " +
                            item.getCalories() + "\nDispensing Change: " + balance);
                    VENDINGVIEW.initializeShowVault(VENDINGMODEL.getCurrentVendingMachine(), true);
                }
//                else
//                    VENDINGVIEW.showMessageDialog("Dispensing: " + item.getItemName() + "\nCalories: " +
//                            item.getCalories());
            } catch (NumberFormatException ex) {
                VENDINGVIEW.showErrorDialog("Invalid input.");
            } catch (IndexOutOfBoundsException ex) {
                VENDINGVIEW.showErrorDialog("Invalid slot number.");
            } finally {
                VENDINGVIEW.initializeRegularVendingFeature();
                setRegularVendingFeatureBackButton();
                setupRegularVendingFeature();
            }
        });
    }

    public void setSpecialCheckoutButton(){
        if(VENDINGMODEL.getSpecialVendingMachine().isItemQueueEmpty())
            VENDINGVIEW.showErrorDialog("You cannot checkout the Yoghurt Itself. Please add toppings");
        else{
            VENDINGVIEW.initializeShowCart(VENDINGMODEL.getSpecialVendingMachine().getItemQueue(),
                    VENDINGMODEL.getSpecialVendingMachine().getYoghurtSlot());
            VENDINGVIEW.initializeShowVault(VENDINGMODEL.getCurrentVendingMachine(), true);
            int errorType = VENDINGMODEL.checkOutMadeProduct();
            if (errorType == 1)
                VENDINGVIEW.showErrorDialog("Insufficient money.");
            else if (errorType == 2)
                VENDINGVIEW.showErrorDialog("Vending machine doesn't have change.");
            else if (errorType == 3)
                VENDINGVIEW.showErrorDialog("Vending Machine Yoghurt is out of stuck! Sorry for the inconvenience.");
            else{
                VENDINGVIEW.initializeShowChange(VENDINGMODEL.getCurrentVendingMachine().getChangeCount());
                VENDINGVIEW.showMessageDialogWithDelay("Cooling Yoghurt...", 0);
                VENDINGVIEW.showMessageDialogWithDelay("Putting Yoghurt in cup...", 10000);
                VENDINGVIEW.showMessageDialogWithDelay("Putting Toppings...", 15000);
                VENDINGVIEW.showMessageDialogWithDelay("Packaging Yoghurt...", 18000);
                VENDINGVIEW.showMessageDialogWithDelay("Yoghurt is ready!", 20000);
                VENDINGVIEW.showMessageDialogWithDelay("Dispensing Change: " + errorType, 23000);
                VENDINGVIEW.initializeShowVault(VENDINGMODEL.getCurrentVendingMachine(), false);
                VENDINGVIEW.showMessageDialog(" ");
            }
        }

        VENDINGVIEW.initializeSpecialVendingFeature();
        setupSpecialVendingFeature();
    }
}
