import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.HashMap;

public class VendingView {
    private JFrame mainFrame;
    private JLabel insertedCashLabel;
    private JButton continueVendingMachine, homeVendingButton, createVendingButton, createVendingBackButton, testVendingButton, showVendingButton,
            regularVendingTypeButton, specialVendingTypeButton,vendingRegularInfoButton, vendingSpecialInfoButton,
            enterVendingNumButton, featureBackButton, maintenanceFeatureButton, vendingFeatureButton, regularVendingFeatureBackButton,
            specialVendingFeatureBackButton, regularMaintenanceFeatureBackButton, specialMaintenanceFeatureBackButton,
            checkoutMadeProductButton, refillYoghurtButton, showYoghurtQuantityButton, registerRegularItemButton,
            editRegularItemButton, enterSauceNameToEditSpecialEnterButton, displayItemInSlotButton, enterItemNameToEditRegularButton,
            enterItemNameToEditSpecialButton, restockButton, restockAddButton, setNewPriceButton, newPriceConfirmButton,
            emptySlotButton,emptyCartButton, restockSauceButton,setNewPriceSauceButton,emptySlotSauceButton, displayVaultCashButton,
            replenishVaultButton, transactionSummaryButton, collectVaultMoneyButton, insertCashButton, checkoutItemButton,
            addSauceToCartButton, addItemToCartButton, dispenseMoneyButton, registerItemInfoButton,registerSpecialItemButton,
            editSpecialItemButton,displaySauceInSlotButton, displayCartButton, denomination1Button,denomination5Button,
            denomination10Button, denomination20Button, denomination50Button, denomination100Button, denomination200Button,
            denomination500Button, denomination1000Button, insertCashDoneButton, checkoutEnterButton, registerSauceButton,
            editSauceButton,addItemToCartEnterButton,addSauceToCartEnterButton, registerSauceInfoButton,restockAddSauceEnterButton
            ,newSaucePriceConfirmButton;

    private JTextField regularVendingNameTextField, regularSlotCountTextField, regularSlotCapacityTextField, specialVendingNameTextField,
                specialSlotCapacityTextField, specialSlotSauceCapacityTextField,vendingNumTextField, itemNameTextField,
            itemPriceTextField,itemCaloriesTextField,itemDescriptionTextField, itemQuantityTextField, itemNameToEditTextField,
            quantityToAddTextField,  newPriceTextField, slotNumToCheckoutTextField, slotNumToAddToCartItemTextField
            ,  slotNumToAddToCartSauceTextField, sauceNameTextField,saucePriceTextField,sauceCaloriesTextField,
            sauceDescriptionTextField,sauceQuantityTextField, sauceNameToEditTextField,quantityToAddSauceTextField
                , newPriceSauceTextField;
    private JDialog vaultDialog, currentDialog, changeDialog;
    private JTable vaultTable, changeTable;


    public VendingView(){
        homeVendingButton = new JButton("Home");
        featureBackButton = new JButton("Back");
        regularMaintenanceFeatureBackButton = new JButton("Back");
        specialMaintenanceFeatureBackButton = new JButton("Back");
        regularVendingFeatureBackButton = new JButton("Back");
        specialVendingFeatureBackButton = new JButton("Back");
        initializeFrame();
    }

    public void initializeFrame() {
        // Introduction Message
        this.mainFrame = new JFrame();
        this.mainFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.mainFrame.setTitle("Vending Machine Factory");
        this.mainFrame.getContentPane().setBackground(Color.WHITE);
        this.mainFrame.setResizable(true);
        this.mainFrame.setSize(1300, 900);

        JLabel welcomeLabel = new JLabel("Welcome to Vending Machine Factory!");
        welcomeLabel.setFont(new Font(null, Font.PLAIN, 60));
        welcomeLabel.setHorizontalAlignment(SwingConstants.CENTER);

        JPanel centerPanel = new JPanel(new GridBagLayout());
        centerPanel.setBackground(Color.WHITE);

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 0, 0);
        continueVendingMachine = new JButton("Continue");
        centerPanel.add(continueVendingMachine, gbc);

        JLabel authorLabel = new JLabel("By: Aljirah Y. Resurreccion || Andrei G. Tamse");
        authorLabel.setFont(new Font(null, Font.PLAIN, 20));

        this.mainFrame.add(welcomeLabel, BorderLayout.NORTH);
        this.mainFrame.add(centerPanel, BorderLayout.CENTER);
        this.mainFrame.add(authorLabel, BorderLayout.SOUTH);
        this.mainFrame.setVisible(true);
    }



    public void resetFrame() {
        this.mainFrame.getContentPane().removeAll();
        this.mainFrame.revalidate();
        this.mainFrame.repaint();
    }

    public void initializeVendingMode(){
        resetFrame();
        JPanel vendingModePanel = new JPanel(new GridBagLayout());
        vendingModePanel.setBackground(Color.WHITE);

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 0, 0);

        JLabel chooseVendingModeLabel = new JLabel("Choose Vending Machine mode:");
        vendingModePanel.add(chooseVendingModeLabel, gbc);

        gbc.gridy = 1;
        createVendingButton = new JButton("Create a Vending Machine");
        createVendingButton.setPreferredSize(new Dimension(200, 30));
        vendingModePanel.add(createVendingButton, gbc);

        gbc.gridy = 2;
        testVendingButton = new JButton("Test a Vending Machine");
        testVendingButton.setPreferredSize(new Dimension(200, 30));
        vendingModePanel.add(testVendingButton, gbc);

        gbc.gridy = 3;
        showVendingButton = new JButton("Show Vending Machines");
        showVendingButton.setPreferredSize(new Dimension(200, 30));
        vendingModePanel.add(showVendingButton, gbc);


        this.mainFrame.getContentPane().add(vendingModePanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }
    public void initializeVendingType() {
        resetFrame();
        JPanel vendingTypePanel = new JPanel(new GridBagLayout());
        vendingTypePanel.setBackground(Color.WHITE);

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 0, 0);

        JLabel chooseVendingTypeLabel = new JLabel("Choose Vending Machine Type:");
        vendingTypePanel.add( chooseVendingTypeLabel, gbc);

        gbc.gridy = 1;
        regularVendingTypeButton = new JButton("Regular Vending Machine");
        vendingTypePanel.add(regularVendingTypeButton, gbc);

        gbc.gridy = 2;
        specialVendingTypeButton = new JButton("Yoghurt Vending Machine");
        vendingTypePanel.add(specialVendingTypeButton, gbc);

        gbc.gridy = 3;
        createVendingBackButton = new JButton("Back");
        vendingTypePanel.add(homeVendingButton, gbc);

        this.mainFrame.getContentPane().add(vendingTypePanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void initializeCreateRegularVending() {
        resetFrame();

        JPanel createRegularVendingPanel = new JPanel();
        createRegularVendingPanel.setBackground(Color.WHITE);
        createRegularVendingPanel.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 0, 0);

        JLabel vendingNameLabel = new JLabel("Vending Machine Name ");
        createRegularVendingPanel.add(vendingNameLabel, gbc);

        gbc.gridy = 1;
        JLabel slotCountLabel = new JLabel("Slot Count ");
        createRegularVendingPanel.add(slotCountLabel, gbc);

        gbc.gridy = 2;
        JLabel slotCapacityLabel = new JLabel("Slot Capacity ");
        createRegularVendingPanel.add(slotCapacityLabel, gbc);

        gbc.gridx = 1;
        gbc.gridy = 0;
        regularVendingNameTextField = new JTextField(10);
        createRegularVendingPanel.add(regularVendingNameTextField, gbc);

        gbc.gridy = 1;
        regularSlotCountTextField = new JTextField(10);
        createRegularVendingPanel.add(regularSlotCountTextField, gbc);

        gbc.gridy = 2;
        regularSlotCapacityTextField = new JTextField(10);
        createRegularVendingPanel.add(regularSlotCapacityTextField, gbc);

        gbc.gridy = 4;
        vendingRegularInfoButton = new JButton("Enter");
        vendingRegularInfoButton.setPreferredSize(new Dimension(90, 25));
        createRegularVendingPanel.add(vendingRegularInfoButton, gbc);

        gbc.gridy = 5;
        createRegularVendingPanel.add(createVendingBackButton, gbc);

        mainFrame.getContentPane().add(createRegularVendingPanel, BorderLayout.CENTER);
        mainFrame.setVisible(true);
    }
    public void initializeCreateSpecialVending() {
        resetFrame();

        JPanel createSpecialVendingPanel = new JPanel();
        createSpecialVendingPanel.setBackground(Color.WHITE);
        createSpecialVendingPanel.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 0, 0);

        JLabel vendingNameLabel = new JLabel("Vending Machine Name ");
        createSpecialVendingPanel.add(vendingNameLabel, gbc);

        gbc.gridy = 1;
        JLabel slotCapacityLabel = new JLabel("Slot Capacity ");
        createSpecialVendingPanel.add(slotCapacityLabel, gbc);

        gbc.gridy = 2;
        JLabel slotSauceCapacityLabel = new JLabel("Slot Sauce Capacity ");
        createSpecialVendingPanel.add(slotSauceCapacityLabel, gbc);

        gbc.gridx = 1;
        gbc.gridy = 0;
        specialVendingNameTextField = new JTextField(10);
        createSpecialVendingPanel.add(specialVendingNameTextField, gbc);

        gbc.gridy = 1;
        specialSlotCapacityTextField = new JTextField(10);
        createSpecialVendingPanel.add(specialSlotCapacityTextField, gbc);

        gbc.gridy = 2;
        specialSlotSauceCapacityTextField = new JTextField(10);
        createSpecialVendingPanel.add(specialSlotSauceCapacityTextField, gbc);

        gbc.gridy = 3;
        vendingSpecialInfoButton = new JButton("Enter");
        vendingSpecialInfoButton.setPreferredSize(new Dimension(90, 25));
        createSpecialVendingPanel.add(vendingSpecialInfoButton, gbc);

        gbc.gridy = 4;
        createSpecialVendingPanel.add(createVendingBackButton, gbc);
        mainFrame.getContentPane().add(createSpecialVendingPanel, BorderLayout.CENTER);
        mainFrame.setVisible(true);
    }

    public void initializeShowVending(ArrayList<RegularVendingMachine> regularVendingMachines,ArrayList<SpecialVendingMachine> specialVendingMachines){
        JDialog listOfVendingDialog = new JDialog();
        listOfVendingDialog.setTitle("List of Vending Machines");
        listOfVendingDialog.setDefaultCloseOperation(JDialog.DISPOSE_ON_CLOSE);
        listOfVendingDialog.setSize(500, 300);
        listOfVendingDialog.setLocationRelativeTo(null); // Center the dialog on the screen

        JPanel vendingListTablePanel = new JPanel();
        vendingListTablePanel.setLayout(new BorderLayout());

        String[] columnNames = {"Machine Number", "Vending Machine Name", "Vending Machine Type"};
        DefaultTableModel listofVendingDefaultTableModel = new DefaultTableModel(null, columnNames);
        JTable listOfVendingTable = new JTable(listofVendingDefaultTableModel);
        listOfVendingTable.setLayout(new BorderLayout());

        int i = 0;
        if (regularVendingMachines != null) {
            for (i = 0; i < regularVendingMachines.size(); i++) {
                RegularVendingMachine machine = regularVendingMachines.get(i);
                listofVendingDefaultTableModel.addRow(new Object[]{i+1, machine.getVendingMachineName(), "Regular"});
            }
        }

        if (specialVendingMachines != null) {
            for (int j = 0; j < specialVendingMachines.size(); j++) {
                SpecialVendingMachine machine = specialVendingMachines.get(j);
                listofVendingDefaultTableModel.addRow(new Object[]{j + i+1, machine.getVendingMachineName(), "Special"});
            }
        }

        JScrollPane listOfVendingScrollPane = new JScrollPane(listOfVendingTable);
        vendingListTablePanel.add(listOfVendingScrollPane, BorderLayout.CENTER);
        listOfVendingDialog.add(vendingListTablePanel);
        listOfVendingDialog.setVisible(true);

    }

    public void initializeVendingToTest() {
        resetFrame();

        JPanel editVendingPanel = new JPanel();
        editVendingPanel.setBackground(Color.WHITE);
        editVendingPanel.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 0, 0);

        JLabel enterVendingNumLabel = new JLabel("Enter Vending Number to Test");
        editVendingPanel.add(enterVendingNumLabel, gbc);

        gbc.gridy = 1;
        vendingNumTextField = new JTextField(10);
        editVendingPanel.add(vendingNumTextField, gbc);

        gbc.gridy = 2;
        enterVendingNumButton = new JButton("Enter");
        enterVendingNumButton.setPreferredSize(new Dimension(90, 25));
        editVendingPanel.add(enterVendingNumButton, gbc);

        gbc.gridy = 3;
        editVendingPanel.add(homeVendingButton, gbc);

        this.mainFrame.add(editVendingPanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

     public void initializeFeature(){
        resetFrame();

        JPanel featuresPanel = new JPanel(new GridBagLayout());
        featuresPanel.setBackground(Color.WHITE);

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 0, 0);

        JLabel chooseVendingFeatureLabel = new JLabel("Select Vending Machine Features");
        featuresPanel.add(chooseVendingFeatureLabel, gbc);

        gbc.gridy = 1;
        maintenanceFeatureButton = new JButton("Maintenance Features");
        maintenanceFeatureButton.setPreferredSize(new Dimension(160, 30));
        featuresPanel.add(maintenanceFeatureButton, gbc);

        gbc.gridy = 2;
        vendingFeatureButton = new JButton("Vending Features");
        vendingFeatureButton.setPreferredSize(new Dimension(160, 30));
        featuresPanel.add(vendingFeatureButton, gbc);

        gbc.gridy = 3;
        featuresPanel.add(homeVendingButton, gbc);

        this.mainFrame.getContentPane().add(featuresPanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void initializeRegularMaintenanceFeature() {
        resetFrame();

        JPanel maintenanceFeaturePanel = new JPanel(new GridBagLayout());
        maintenanceFeaturePanel.setBackground(Color.WHITE);

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 0, 0);
        JLabel maintenanceFeatureLabel = new JLabel("Select Maintenance Feature");
        maintenanceFeaturePanel.add(maintenanceFeatureLabel, gbc);

        gbc.gridy = 1;
        registerRegularItemButton = new JButton("Register New Item");
        registerRegularItemButton.setPreferredSize(new Dimension(160, 30));
        maintenanceFeaturePanel.add(registerRegularItemButton, gbc);

        gbc.gridy = 2;
        editRegularItemButton = new JButton("Edit Items");
        editRegularItemButton.setPreferredSize(new Dimension(160, 30));
        maintenanceFeaturePanel.add(editRegularItemButton, gbc);

        gbc.gridy = 3;
        displayItemInSlotButton = new JButton("Show Item");
        displayItemInSlotButton.setPreferredSize(new Dimension(160, 30));
        maintenanceFeaturePanel.add(displayItemInSlotButton, gbc);

        gbc.gridy = 4;
        displayVaultCashButton = new JButton("Display Vault Cash");
        displayVaultCashButton.setPreferredSize(new Dimension(160, 30));
        maintenanceFeaturePanel.add(displayVaultCashButton, gbc);

        gbc.gridy = 5;
        replenishVaultButton = new JButton("Replenish Vault");
        replenishVaultButton.setPreferredSize(new Dimension(160, 30));
        maintenanceFeaturePanel.add(replenishVaultButton, gbc);

        gbc.gridy = 6;
        transactionSummaryButton = new JButton("Transaction Summary");
        transactionSummaryButton.setPreferredSize(new Dimension(160, 30));
        maintenanceFeaturePanel.add(transactionSummaryButton, gbc);


        gbc.gridy = 7;
        collectVaultMoneyButton = new JButton("Collect Vault Money");
        collectVaultMoneyButton.setPreferredSize(new Dimension(160, 30));
        maintenanceFeaturePanel.add(collectVaultMoneyButton, gbc);

        gbc.gridy = 8;
        maintenanceFeaturePanel.add(featureBackButton, gbc);

        this.mainFrame.getContentPane().add(maintenanceFeaturePanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void initializeSpecialMaintenanceFeature() {
        resetFrame();

        JPanel maintenanceFeaturePanel = new JPanel(new GridBagLayout());
        maintenanceFeaturePanel.setBackground(Color.WHITE);

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 0, 0);
        JLabel maintenanceFeatureLabel = new JLabel("Select Yoghurt Maintenance Feature");
        maintenanceFeaturePanel.add(maintenanceFeatureLabel, gbc);

        gbc.gridy = 1;
        registerSpecialItemButton = new JButton("Register New Item");
        registerSpecialItemButton.setPreferredSize(new Dimension(160, 30));
        maintenanceFeaturePanel.add(registerSpecialItemButton, gbc);

        gbc.gridy = 2;
        editSpecialItemButton = new JButton("Edit Items");
        editSpecialItemButton.setPreferredSize(new Dimension(160, 30));
        maintenanceFeaturePanel.add(editSpecialItemButton, gbc);

        gbc.gridy = 3;
        displayItemInSlotButton = new JButton("Show Item");
        displayItemInSlotButton.setPreferredSize(new Dimension(160, 30));
        maintenanceFeaturePanel.add(displayItemInSlotButton, gbc);

        gbc.gridy = 4;
        registerSauceButton = new JButton("Register New Sauce");
        registerSauceButton.setPreferredSize(new Dimension(160, 30));
        maintenanceFeaturePanel.add(registerSauceButton, gbc);

        gbc.gridy = 5;
        editSauceButton = new JButton("Edit Sauce");
        editSauceButton.setPreferredSize(new Dimension(160, 30));
        maintenanceFeaturePanel.add(editSauceButton, gbc);

        gbc.gridy = 6;
        displaySauceInSlotButton = new JButton("Show Sauce");
        displaySauceInSlotButton.setPreferredSize(new Dimension(160, 30));
        maintenanceFeaturePanel.add(displaySauceInSlotButton, gbc);

        gbc.gridy = 7;
        refillYoghurtButton = new JButton("Refill Yoghurt Tank");
        refillYoghurtButton.setPreferredSize(new Dimension(160, 30));
        maintenanceFeaturePanel.add(refillYoghurtButton, gbc);

        gbc.gridy = 8;
        showYoghurtQuantityButton = new JButton("Show Yoghurt Stock");
        showYoghurtQuantityButton.setPreferredSize(new Dimension(160, 30));
        maintenanceFeaturePanel.add(showYoghurtQuantityButton, gbc);

        gbc.gridy = 9;
        displayVaultCashButton = new JButton("Display Vault Cash");
        displayVaultCashButton.setPreferredSize(new Dimension(160, 30));
        maintenanceFeaturePanel.add(displayVaultCashButton, gbc);

        gbc.gridy = 10;
        replenishVaultButton = new JButton("Replenish Vault");
        replenishVaultButton.setPreferredSize(new Dimension(160, 30));
        maintenanceFeaturePanel.add(replenishVaultButton, gbc);

        gbc.gridy = 11;
        transactionSummaryButton = new JButton("Transaction Summary");
        transactionSummaryButton.setPreferredSize(new Dimension(160, 30));
        maintenanceFeaturePanel.add(transactionSummaryButton, gbc);

        gbc.gridy = 12;
        collectVaultMoneyButton = new JButton("Collect Vault Money");
        collectVaultMoneyButton.setPreferredSize(new Dimension(160, 30));
        maintenanceFeaturePanel.add(collectVaultMoneyButton, gbc);

        gbc.gridy = 13;
        maintenanceFeaturePanel.add(featureBackButton, gbc);

        this.mainFrame.getContentPane().add(maintenanceFeaturePanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }


    public void initializeRegisterRegularItem() {
        resetFrame();

        JPanel registerItemPanel = new JPanel();
        registerItemPanel.setBackground(Color.WHITE);
        registerItemPanel.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 0, 0);

        JLabel itemDetailsLabel = new JLabel("Enter item details");
        registerItemPanel.add(itemDetailsLabel, gbc);

        gbc.gridy = 1;
        JLabel itemNameLabel = new JLabel("Name");
        registerItemPanel.add(itemNameLabel, gbc);

        gbc.gridy = 2;
        JLabel itemPriceLabel = new JLabel("Price");
        registerItemPanel.add(itemPriceLabel, gbc);

        gbc.gridy = 3;
        JLabel itemCaloriesLabel = new JLabel("Calories");
        registerItemPanel.add(itemCaloriesLabel, gbc);

        gbc.gridy = 4;
        JLabel itemDescriptionLabel = new JLabel("Description");
        registerItemPanel.add(itemDescriptionLabel, gbc);

        gbc.gridy = 5;
        JLabel itemQuantityLabel = new JLabel("Quantity");
        registerItemPanel.add(itemQuantityLabel, gbc);

        gbc.gridx = 1;
        gbc.gridy = 1;
        itemNameTextField = new JTextField(10);
        registerItemPanel.add(itemNameTextField, gbc);

        gbc.gridy = 2;
        itemPriceTextField = new JTextField(10);
        registerItemPanel.add(itemPriceTextField, gbc);

        gbc.gridy = 3;
        itemCaloriesTextField = new JTextField(10);
        registerItemPanel.add(itemCaloriesTextField, gbc);

        gbc.gridy = 4;
        itemDescriptionTextField = new JTextField(10);
        registerItemPanel.add(itemDescriptionTextField, gbc);

        gbc.gridy = 5;
        itemQuantityTextField = new JTextField(10);
        registerItemPanel.add(itemQuantityTextField, gbc);

        gbc.gridy = 6;
        gbc.gridx = 1;
        gbc.anchor = GridBagConstraints.CENTER;

        registerItemInfoButton = new JButton("Enter");
        registerItemInfoButton.setPreferredSize(new Dimension(90, 25));
        registerItemPanel.add(registerItemInfoButton, gbc);

        gbc.gridy = 7;
        registerItemPanel.add(regularMaintenanceFeatureBackButton, gbc);

        this.mainFrame.getContentPane().add(registerItemPanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void initializeRegisterSpecialItem(){
        resetFrame();

        JPanel registerItemPanel = new JPanel();
        registerItemPanel.setBackground(Color.WHITE);
        registerItemPanel.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 0, 0);

        JLabel itemDetailsLabel = new JLabel("Enter item details");
        registerItemPanel.add(itemDetailsLabel, gbc);

        gbc.gridy = 1;
        JLabel itemNameLabel = new JLabel("Name");
        registerItemPanel.add(itemNameLabel, gbc);

        gbc.gridy = 2;
        JLabel itemPriceLabel = new JLabel("Price");
        registerItemPanel.add(itemPriceLabel, gbc);

        gbc.gridy = 3;
        JLabel itemCaloriesLabel = new JLabel("Calories");
        registerItemPanel.add(itemCaloriesLabel, gbc);

        gbc.gridy = 4;
        JLabel itemDescriptionLabel = new JLabel("Description");
        registerItemPanel.add(itemDescriptionLabel, gbc);

        gbc.gridy = 5;
        JLabel itemQuantityLabel = new JLabel("Quantity");
        registerItemPanel.add(itemQuantityLabel, gbc);

        gbc.gridx = 1;
        gbc.gridy = 1;
        itemNameTextField = new JTextField(10);
        registerItemPanel.add(itemNameTextField, gbc);

        gbc.gridy = 2;
        itemPriceTextField = new JTextField(10);
        registerItemPanel.add(itemPriceTextField, gbc);

        gbc.gridy = 3;
        itemCaloriesTextField = new JTextField(10);
        registerItemPanel.add(itemCaloriesTextField, gbc);

        gbc.gridy = 4;
        itemDescriptionTextField = new JTextField(10);
        registerItemPanel.add(itemDescriptionTextField, gbc);

        gbc.gridy = 5;
        itemQuantityTextField = new JTextField(10);
        registerItemPanel.add(itemQuantityTextField, gbc);

        gbc.gridy = 6;
        gbc.gridx = 1;
        gbc.anchor = GridBagConstraints.CENTER;

        registerItemInfoButton = new JButton("Enter");
        registerItemInfoButton.setPreferredSize(new Dimension(90, 25));
        registerItemPanel.add(registerItemInfoButton, gbc);

        gbc.gridy = 7;
        registerItemPanel.add(specialMaintenanceFeatureBackButton, gbc);

        this.mainFrame.getContentPane().add(registerItemPanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void initializeNameToEditItemRegular() {
        resetFrame();

        JPanel itemToEditPanel = new JPanel();
        itemToEditPanel.setBackground(Color.WHITE);
        itemToEditPanel.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 0, 0);

        JLabel itemNameToEditLabel = new JLabel("Enter Item Name to Edit");
        itemToEditPanel.add(itemNameToEditLabel, gbc);

        gbc.gridy = 1;
        itemNameToEditTextField = new JTextField(10);
        itemToEditPanel.add(itemNameToEditTextField, gbc);

        gbc.gridy = 2;
        enterItemNameToEditRegularButton = new JButton("Enter");
        enterItemNameToEditRegularButton.setPreferredSize(new Dimension(90, 25));
        itemToEditPanel.add(enterItemNameToEditRegularButton, gbc);

        gbc.gridy = 3;
        itemToEditPanel.add(regularMaintenanceFeatureBackButton, gbc);

        this.mainFrame.getContentPane().add(itemToEditPanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void initializeNameToEditItemSpecial() {
        resetFrame();

        JPanel itemToEditPanel = new JPanel();
        itemToEditPanel.setBackground(Color.WHITE);
        itemToEditPanel.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 0, 0);

        JLabel itemNameToEditLabel = new JLabel("Enter Item Name to Edit");
        itemToEditPanel.add(itemNameToEditLabel, gbc);

        gbc.gridy = 1;
        itemNameToEditTextField = new JTextField(10);
        itemToEditPanel.add(itemNameToEditTextField, gbc);

        gbc.gridy = 2;
        enterItemNameToEditSpecialButton = new JButton("Enter");
        enterItemNameToEditSpecialButton.setPreferredSize(new Dimension(90, 25));
        itemToEditPanel.add(enterItemNameToEditSpecialButton, gbc);

        gbc.gridy = 3;
        itemToEditPanel.add(specialMaintenanceFeatureBackButton, gbc);

        this.mainFrame.getContentPane().add(itemToEditPanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void initializeSauceNameToEditItemSpecial() {
        resetFrame();

        JPanel itemToEditPanel = new JPanel();
        itemToEditPanel.setBackground(Color.WHITE);
        itemToEditPanel.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 0, 0);

        JLabel itemNameToEditLabel = new JLabel("Enter Sauce Name to Edit");
        itemToEditPanel.add(itemNameToEditLabel, gbc);

        gbc.gridy = 1;
        sauceNameToEditTextField = new JTextField(10);
        itemToEditPanel.add(sauceNameToEditTextField, gbc);

        gbc.gridy = 2;
        enterSauceNameToEditSpecialEnterButton = new JButton("Enter");
        enterSauceNameToEditSpecialEnterButton.setPreferredSize(new Dimension(90, 25));
        itemToEditPanel.add(enterSauceNameToEditSpecialEnterButton, gbc);

        gbc.gridy = 3;
        itemToEditPanel.add(specialMaintenanceFeatureBackButton, gbc);

        this.mainFrame.getContentPane().add(itemToEditPanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void initializeEditItemRegular(){
        resetFrame();

        JPanel editItemPanel = new JPanel();
        editItemPanel.setBackground(Color.WHITE);
        editItemPanel.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        JLabel selectEditTypeLabel = new JLabel ("Choose Edit Mode: ");
        gbc.insets = new Insets(10, 0, 0, 0);
        editItemPanel.add(selectEditTypeLabel, gbc);

        gbc.gridy = 1;
        restockButton = new JButton("Restock");
        restockButton.setPreferredSize(new Dimension(130, 30));
        editItemPanel.add(restockButton, gbc);

        gbc.gridy = 2;
        setNewPriceButton = new JButton("Set New Price");
        setNewPriceButton.setPreferredSize(new Dimension(130, 30));
        editItemPanel.add(setNewPriceButton, gbc);

        gbc.gridy = 3;
        emptySlotButton = new JButton("Empty Slot");
        emptySlotButton.setPreferredSize(new Dimension(130, 30));
        editItemPanel.add(emptySlotButton, gbc);

        gbc.gridy = 4;
        editItemPanel.add(regularMaintenanceFeatureBackButton, gbc);

        this.mainFrame.getContentPane().add(editItemPanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void initializeEditItemSpecial(){
        resetFrame();

        JPanel editItemPanel = new JPanel();
        editItemPanel.setBackground(Color.WHITE);
        editItemPanel.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        JLabel selectEditTypeLabel = new JLabel ("Choose Edit Mode: ");
        gbc.insets = new Insets(10, 0, 0, 0);
        editItemPanel.add(selectEditTypeLabel, gbc);

        gbc.gridy = 1;
        restockButton = new JButton("Restock");
        restockButton.setPreferredSize(new Dimension(130, 30));
        editItemPanel.add(restockButton, gbc);

        gbc.gridy = 2;
        setNewPriceButton = new JButton("Set New Price");
        setNewPriceButton.setPreferredSize(new Dimension(130, 30));
        editItemPanel.add(setNewPriceButton, gbc);

        gbc.gridy = 3;
        emptySlotButton = new JButton("Empty Slot");
        emptySlotButton.setPreferredSize(new Dimension(130, 30));
        editItemPanel.add(emptySlotButton, gbc);

        gbc.gridy = 4;
        editItemPanel.add(specialMaintenanceFeatureBackButton, gbc);

        this.mainFrame.getContentPane().add(editItemPanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void initializeRegisterSauce(){
        resetFrame();

        JPanel registerSaucePanel = new JPanel();
        registerSaucePanel.setBackground(Color.WHITE);
        registerSaucePanel.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 0, 0);

        JLabel sauceDetailsLabel = new JLabel("Enter sauce details");
        registerSaucePanel.add(sauceDetailsLabel, gbc);

        gbc.gridy = 1;
        JLabel sauceNameLabel = new JLabel("Name");
        registerSaucePanel.add(sauceNameLabel, gbc);

        gbc.gridy = 2;
        JLabel saucePriceLabel = new JLabel("Price");
        registerSaucePanel.add(saucePriceLabel, gbc);

        gbc.gridy = 3;
        JLabel sauceCaloriesLabel = new JLabel("Calories");
        registerSaucePanel.add(sauceCaloriesLabel, gbc);

        gbc.gridy = 4;
        JLabel sauceDescriptionLabel = new JLabel("Description");
        registerSaucePanel.add(sauceDescriptionLabel, gbc);

        gbc.gridy = 5;
        JLabel sauceQuantityLabel = new JLabel("Quantity");
        registerSaucePanel.add(sauceQuantityLabel, gbc);

        gbc.gridx = 1;
        gbc.gridy = 1;
        sauceNameTextField = new JTextField(10);
        registerSaucePanel.add(sauceNameTextField, gbc);

        gbc.gridy = 2;
        saucePriceTextField = new JTextField(10);
        registerSaucePanel.add(saucePriceTextField, gbc);

        gbc.gridy = 3;
        sauceCaloriesTextField = new JTextField(10);
        registerSaucePanel.add(sauceCaloriesTextField, gbc);

        gbc.gridy = 4;
        sauceDescriptionTextField = new JTextField(10);
        registerSaucePanel.add(sauceDescriptionTextField, gbc);

        gbc.gridy = 5;
        sauceQuantityTextField = new JTextField(10);
        registerSaucePanel.add(sauceQuantityTextField, gbc);

        gbc.gridy = 6;
        gbc.gridx = 1;
        gbc.anchor = GridBagConstraints.CENTER;

        registerSauceInfoButton = new JButton("Enter");
        registerSauceInfoButton.setPreferredSize(new Dimension(90, 25));
        registerSaucePanel.add(registerSauceInfoButton, gbc);

        gbc.gridy = 7;
        registerSaucePanel.add(specialMaintenanceFeatureBackButton, gbc);

        this.mainFrame.getContentPane().add(registerSaucePanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void initializeRestockItem(){
        resetFrame();

        JPanel restockPanel = new JPanel();
        restockPanel.setBackground(Color.WHITE);
        restockPanel.setLayout(new GridBagLayout());

        JLabel quantityToAddLabel = new JLabel("Quantity to Add: ");
        restockPanel.add(quantityToAddLabel);

        quantityToAddTextField = new JTextField(10);
        restockPanel.add(quantityToAddTextField);

        restockAddButton = new JButton("Add");
        restockPanel.add(restockAddButton);

        this.mainFrame.getContentPane().add(restockPanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void initializeNewItemPrice(){
        resetFrame();

        JPanel newPricePanel = new JPanel();
        newPricePanel.setBackground(Color.WHITE);
        newPricePanel.setLayout(new GridBagLayout());

        JLabel newPriceLabel = new JLabel("New price: ");
        newPricePanel.add(newPriceLabel);

        newPriceTextField = new JTextField(10);
        newPricePanel.add(newPriceTextField);
        newPriceConfirmButton = new JButton("Confirm");
        newPricePanel.add(newPriceConfirmButton);

        this.mainFrame.getContentPane().add(newPricePanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void initializeShowItem(ItemSlot [] itemSlots) {
        JDialog itemDialog = new JDialog();
        itemDialog.setTitle("Items in Vending Machine");
        itemDialog.setDefaultCloseOperation(JDialog.DISPOSE_ON_CLOSE);
        itemDialog.setSize(700, 400);
        itemDialog.setLocationRelativeTo(null);

        JPanel itemPanel = new JPanel();
        itemPanel.setLayout(new BorderLayout());

        String[] columnNames = {"Slot #", "Item Name", "Price", "Calories", "Description", "Quantity "};
        DefaultTableModel itemTableModel = new DefaultTableModel(null, columnNames);
        JTable itemTable = new JTable(itemTableModel);


        for (int i = 0; i <  itemSlots.length; i++){
            String itemName =  itemSlots[i].getItem().getItemName();
            float itemPrice = itemSlots[i].getItem().getPrice();
            float itemCalories = itemSlots[i].getItem().getCalories();
            String itemDescription = itemSlots[i].getItem().getDescription();
            int quantity = itemSlots[i].getQuantity();

            itemTableModel.addRow(new Object[]{i + 1, itemName, itemPrice, itemCalories, itemDescription, quantity});
        }

        JScrollPane itemScrollPane = new JScrollPane(itemTable);
        itemPanel.add(itemScrollPane, BorderLayout.CENTER);
        itemDialog.add(itemPanel);
        itemDialog.setVisible(true);
    }

    public void initializeEditSauce(){
        resetFrame();

        JPanel editSaucePanel = new JPanel();
        editSaucePanel.setBackground(Color.WHITE);
        editSaucePanel.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        JLabel selectEditTypeLabel = new JLabel ("Choose Edit Mode: ");
        gbc.insets = new Insets(10, 0, 0, 0);
        editSaucePanel.add(selectEditTypeLabel, gbc);

        gbc.gridy = 1;
        restockSauceButton = new JButton("Restock");
        restockSauceButton.setPreferredSize(new Dimension(130, 30));
        editSaucePanel.add(restockSauceButton, gbc);

        gbc.gridy = 2;
        setNewPriceSauceButton = new JButton("Set New Price");
        setNewPriceSauceButton.setPreferredSize(new Dimension(130, 30));
        editSaucePanel.add(setNewPriceSauceButton, gbc);

        gbc.gridy = 3;
        emptySlotSauceButton = new JButton("Empty Slot");
        emptySlotSauceButton.setPreferredSize(new Dimension(130, 30));
        editSaucePanel.add(emptySlotSauceButton, gbc);

        gbc.gridy = 4;
        editSaucePanel.add(specialMaintenanceFeatureBackButton, gbc);

        this.mainFrame.getContentPane().add(editSaucePanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void initializeShowVault(RegularVendingMachine vendingMachine, boolean isStash) {
        if (vaultDialog == null || !vaultDialog.isVisible()) {
            vaultDialog = new JDialog();
            vaultDialog.setTitle("Money Details");
            vaultDialog.setDefaultCloseOperation(JDialog.HIDE_ON_CLOSE);
            vaultDialog.setSize(500, 300);

            Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
            int xCoordinate = screenSize.width - vaultDialog.getWidth();
            int yCoordinate = (screenSize.height - vaultDialog.getHeight()) / 2;
            vaultDialog.setLocation(xCoordinate, yCoordinate);

            JPanel vaultPanel = new JPanel();
            vaultPanel.setLayout(new BorderLayout());

            String[] columnNames = {"Denomination", "Quantity", "Total"};
            DefaultTableModel vaultTableModel = new DefaultTableModel(null, columnNames);
            vaultTable = new JTable(vaultTableModel);

            JScrollPane vaultScrollPane = new JScrollPane(vaultTable);
            vaultPanel.add(vaultScrollPane, BorderLayout.CENTER);
            vaultDialog.add(vaultPanel);
        }

        DefaultTableModel vaultTableModel = (DefaultTableModel) vaultTable.getModel();
        vaultTableModel.setRowCount(0);

        HashMap<Integer, ArrayList<Money>> cashBox;
        if (isStash)
            cashBox = vendingMachine.getStash().getMoneyList();
        else
            cashBox = vendingMachine.getVault().getMoneyList();
        int totalSum = 0;

        for (HashMap.Entry<Integer, ArrayList<Money>> entry : cashBox.entrySet()) {
            int denomination = entry.getKey();
            int quantity = entry.getValue().size();
            int subtotal = denomination * quantity;
            totalSum += subtotal;

            vaultTableModel.addRow(new Object[]{denomination, quantity, subtotal});
        }

        vaultTableModel.addRow(new Object[]{"Total:", "", totalSum});
        vaultDialog.setVisible(true);
    }

    public void initializeShowChange( HashMap<Integer, ArrayList<Money>> cashBox) {
            changeDialog = new JDialog();
            changeDialog.setTitle("Dispensing your change.");
            changeDialog.setDefaultCloseOperation(JDialog.HIDE_ON_CLOSE);
            changeDialog.setSize(500, 300);

            Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
            int xCoordinate = screenSize.width - changeDialog.getWidth();
            int yCoordinate = (screenSize.height - changeDialog.getHeight()) / 2;
            changeDialog.setLocation(xCoordinate, yCoordinate);

            JPanel changePanel = new JPanel();
            changePanel.setLayout(new BorderLayout());

            String[] columnNames = {"Denomination", "Quantity", "Total"};
            DefaultTableModel changeTableModel = new DefaultTableModel(null, columnNames);
            changeTable = new JTable(changeTableModel);

            JScrollPane changeScrollPane = new JScrollPane(changeTable);
            changePanel.add(changeScrollPane, BorderLayout.CENTER);
            changeDialog.add(changePanel);

        changeTableModel = (DefaultTableModel) changeTable.getModel();
        changeTableModel.setRowCount(0);

            int totalSum = 0;

            for (HashMap.Entry<Integer, ArrayList<Money>> entry : cashBox.entrySet()) {
                int denomination = entry.getKey();
                int quantity = entry.getValue().size();
                int subtotal = denomination * quantity;
                totalSum += subtotal;

                changeTableModel.addRow(new Object[]{denomination, quantity, subtotal});
            }

            changeTableModel.addRow(new Object[]{"Total:", "", totalSum});
            changeDialog.setVisible(true);
    }

    public void initializeInsertCash(float insertedCash){
        resetFrame();

        JPanel insertCashPanel = new JPanel();
        insertCashPanel.setBackground(Color.WHITE);
        insertCashPanel.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 1;
        gbc.gridy = 0;
        JLabel insertCashLabel = new JLabel("Choose Denomination");
        gbc.insets = new Insets(10, 0, 0, 0);
        insertCashLabel.setFont(new Font(null, Font.PLAIN, 15));
        insertCashPanel.add(insertCashLabel, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        denomination1Button = new JButton("1");
        denomination1Button.setPreferredSize(new Dimension(85, 30));
        insertCashPanel.add(denomination1Button, gbc);


        gbc.gridx = 1;
        denomination5Button = new JButton("5");
        denomination5Button.setPreferredSize(new Dimension(85, 30));
        insertCashPanel.add(denomination5Button, gbc);

        gbc.gridx = 2;
        denomination10Button = new JButton("10");
        denomination10Button.setPreferredSize(new Dimension(85, 30));
        insertCashPanel.add(denomination10Button, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        denomination20Button = new JButton("20");
        denomination20Button.setPreferredSize(new Dimension(85, 30));
        insertCashPanel.add(denomination20Button, gbc);

        gbc.gridx = 1;
        denomination50Button = new JButton("50");
        denomination50Button.setPreferredSize(new Dimension(85, 30));
        insertCashPanel.add(denomination50Button, gbc);

        gbc.gridx = 2;
        denomination100Button = new JButton("100");
        denomination100Button.setPreferredSize(new Dimension(85, 30));
        insertCashPanel.add(denomination100Button, gbc);

        gbc.gridx = 0;
        gbc.gridy = 3;
        denomination200Button = new JButton("200");
        denomination200Button.setPreferredSize(new Dimension(85, 30));
        insertCashPanel.add(denomination200Button, gbc);

        gbc.gridx = 1;
        denomination500Button = new JButton("500");
        denomination500Button.setPreferredSize(new Dimension(85, 30));
        insertCashPanel.add(denomination500Button, gbc);

        gbc.gridx = 2;
        denomination1000Button = new JButton("1000");
        denomination1000Button.setPreferredSize(new Dimension(85, 30));
        insertCashPanel.add(denomination1000Button, gbc);

        gbc.gridx = 1;
        gbc.gridy = 5;
        insertedCashLabel = new JLabel("Total Cash: " + insertedCash);
        insertCashPanel.add(insertedCashLabel, gbc);

        gbc.gridx = 1;
        gbc.gridy = 6;
        insertCashDoneButton = new JButton("Done");
        insertCashDoneButton.setPreferredSize(new Dimension(85, 30));
        insertCashPanel.add(insertCashDoneButton, gbc);


        this.mainFrame.getContentPane().add(insertCashPanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void updateInsertedCashLabel(float newAmount) {
        insertedCashLabel.setText("Total Cash: " + newAmount);
    }

    public void initializeRegularVendingFeature(){
        resetFrame();

        JPanel vendingFeaturePanel = new JPanel(new GridBagLayout());
        vendingFeaturePanel.setBackground(Color.WHITE);

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 0, 0);

        JLabel vendingFeatureLabel = new JLabel("Select Vending Feature");
        vendingFeaturePanel.add(vendingFeatureLabel, gbc);

        gbc.gridy = 1;
        insertCashButton = new JButton("Insert Cash");
        insertCashButton.setPreferredSize(new Dimension(130, 30));
        vendingFeaturePanel.add(insertCashButton , gbc);

        gbc.gridy = 2;
        checkoutItemButton = new JButton("Checkout Item");
        checkoutItemButton.setPreferredSize(new Dimension(130, 30));
        vendingFeaturePanel.add(checkoutItemButton, gbc);

        gbc.gridy = 3;
        displayItemInSlotButton = new JButton("Show Item");
        displayItemInSlotButton.setPreferredSize(new Dimension(130, 30));
        vendingFeaturePanel.add(displayItemInSlotButton, gbc);

        gbc.gridy = 4;
        dispenseMoneyButton = new JButton("Dispense Money");
        dispenseMoneyButton.setPreferredSize(new Dimension(130, 30));
        vendingFeaturePanel.add(dispenseMoneyButton, gbc);

        gbc.gridy = 5;
        vendingFeaturePanel.add(featureBackButton, gbc);

        this.mainFrame.getContentPane().add(vendingFeaturePanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void initializeSpecialVendingFeature(){
        resetFrame();

        JPanel vendingFeaturePanel = new JPanel(new GridBagLayout());
        vendingFeaturePanel.setBackground(Color.WHITE);

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 0, 0);

        JLabel vendingFeatureLabel = new JLabel("Select Yoghurt Vending Feature");
        vendingFeaturePanel.add(vendingFeatureLabel, gbc);

        gbc.gridy = 1;
        insertCashButton = new JButton("Insert Cash");
        insertCashButton.setPreferredSize(new Dimension(170, 30));
        vendingFeaturePanel.add(insertCashButton , gbc);

        gbc.gridy = 2;
        addItemToCartButton = new JButton("Add Item To Cart");
        addItemToCartButton.setPreferredSize(new Dimension(170, 30));
        vendingFeaturePanel.add(addItemToCartButton, gbc);

        gbc.gridy = 3;
        addSauceToCartButton = new JButton("Add Sauce To Cart");
        addSauceToCartButton.setPreferredSize(new Dimension(170, 30));
        vendingFeaturePanel.add(addSauceToCartButton, gbc);

        gbc.gridy = 5;
        displayCartButton = new JButton("Display Cart");
        displayCartButton.setPreferredSize(new Dimension(170, 30));
        vendingFeaturePanel.add(displayCartButton, gbc);

        gbc.gridy = 6;
        emptyCartButton = new JButton("Empty Cart");
        emptyCartButton.setPreferredSize(new Dimension(170, 30));
        vendingFeaturePanel.add(emptyCartButton, gbc);

        gbc.gridy = 7;
        checkoutMadeProductButton = new JButton("Checkout Made Product");
        checkoutMadeProductButton.setPreferredSize(new Dimension(170, 30));
        vendingFeaturePanel.add(checkoutMadeProductButton, gbc);

        gbc.gridy = 8;
        displayItemInSlotButton = new JButton("Show Item");
        displayItemInSlotButton.setPreferredSize(new Dimension(170, 30));
        vendingFeaturePanel.add(displayItemInSlotButton, gbc);

        gbc.gridy = 9;
        displaySauceInSlotButton = new JButton("Show Sauce");
        displaySauceInSlotButton.setPreferredSize(new Dimension(170, 30));
        vendingFeaturePanel.add(displaySauceInSlotButton, gbc);

        gbc.gridy = 10;
        dispenseMoneyButton = new JButton("Dispense Money");
        dispenseMoneyButton.setPreferredSize(new Dimension(170, 30));
        vendingFeaturePanel.add(dispenseMoneyButton, gbc);

        gbc.gridy = 11;
        vendingFeaturePanel.add(featureBackButton, gbc);

        this.mainFrame.getContentPane().add(vendingFeaturePanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }


    public void initializeRegularCheckout(){
        resetFrame();

        JPanel checkoutItemPanel = new JPanel();
        checkoutItemPanel.setBackground(Color.WHITE);
        checkoutItemPanel.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 0, 0);
        JLabel enterSlotNumToCheckoutLabel = new JLabel("Enter Slot Number to Checkout");
        checkoutItemPanel.add(enterSlotNumToCheckoutLabel , gbc);

        gbc.gridy = 1;
        slotNumToCheckoutTextField = new JTextField(10);
        checkoutItemPanel.add(slotNumToCheckoutTextField, gbc);

        gbc.gridy = 2;
        checkoutEnterButton = new JButton("Enter");
        checkoutEnterButton.setPreferredSize(new Dimension(90, 25));
        checkoutItemPanel.add(checkoutEnterButton , gbc);

        gbc.gridy = 3;
        checkoutItemPanel.add(regularVendingFeatureBackButton , gbc);

        this.mainFrame.getContentPane().add(checkoutItemPanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void initializeAddItemToCart(){
        resetFrame();

        JPanel addItemToCartPanel = new JPanel();
        addItemToCartPanel.setBackground(Color.WHITE);
        addItemToCartPanel.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 0, 0);
        JLabel enterSlotNumToAddToCartLabel = new JLabel("Enter Slot Number of Item to Add to Cart (Toppings)");
        addItemToCartPanel.add(enterSlotNumToAddToCartLabel , gbc);

        gbc.gridy = 1;
        slotNumToAddToCartItemTextField = new JTextField(10);
        addItemToCartPanel.add(slotNumToAddToCartItemTextField, gbc);

        gbc.gridy = 2;
        addItemToCartEnterButton = new JButton("Enter");
        addItemToCartEnterButton.setPreferredSize(new Dimension(90, 25));
        addItemToCartPanel.add(addItemToCartEnterButton , gbc);

        gbc.gridy = 3;
        addItemToCartPanel.add(specialVendingFeatureBackButton , gbc);

        this.mainFrame.getContentPane().add(addItemToCartPanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void initializeAddSauceToCart(){
        resetFrame();

        JPanel addSauceToCartPanel = new JPanel();
        addSauceToCartPanel.setBackground(Color.WHITE);
        addSauceToCartPanel.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 0, 0);
        JLabel enterSlotNumToAddToCartLabel = new JLabel("Enter Slot Number of Sauce to Add to Cart");
        addSauceToCartPanel.add(enterSlotNumToAddToCartLabel , gbc);

        gbc.gridy = 1;
        slotNumToAddToCartSauceTextField = new JTextField(10);
        addSauceToCartPanel.add(slotNumToAddToCartSauceTextField, gbc);

        gbc.gridy = 2;
        addSauceToCartEnterButton = new JButton("Enter");
        addSauceToCartEnterButton.setPreferredSize(new Dimension(90, 25));
        addSauceToCartPanel.add(addSauceToCartEnterButton , gbc);

        gbc.gridy = 3;
        addSauceToCartPanel.add(specialVendingFeatureBackButton , gbc);

        this.mainFrame.getContentPane().add(addSauceToCartPanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void intializeRestockSauce(){
        resetFrame();

        JPanel restockSaucePanel = new JPanel();
        restockSaucePanel.setBackground(Color.WHITE);
        restockSaucePanel.setLayout(new GridBagLayout());

        JLabel quantityToAddSauceLabel = new JLabel("Quantity to Add: ");
        restockSaucePanel.add(quantityToAddSauceLabel);

        quantityToAddSauceTextField = new JTextField(10);
        restockSaucePanel.add(quantityToAddSauceTextField);

        restockAddSauceEnterButton = new JButton("Add");
        restockSaucePanel.add(restockAddSauceEnterButton);

        this.mainFrame.getContentPane().add(restockSaucePanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void initializeNewSaucePrice(){
        resetFrame();

        JPanel newPriceSaucePanel = new JPanel();
        newPriceSaucePanel.setBackground(Color.WHITE);
        newPriceSaucePanel.setLayout(new GridBagLayout());

        JLabel newPriceSauceLabel = new JLabel("New price: ");
        newPriceSaucePanel.add(newPriceSauceLabel);

        newPriceSauceTextField = new JTextField(10);
        newPriceSaucePanel.add(newPriceSauceTextField);

        newSaucePriceConfirmButton = new JButton("Confirm");
        newPriceSaucePanel.add(newSaucePriceConfirmButton);

        this.mainFrame.getContentPane().add(newPriceSaucePanel, BorderLayout.CENTER);
        this.mainFrame.setVisible(true);
    }

    public void initializeShowCart(Item[] itemQueue, ItemSlot yoghurtSlot) {
        JDialog showCartDialog = new JDialog();
        showCartDialog.setTitle("Cart Details");
        showCartDialog.setDefaultCloseOperation(JDialog.DISPOSE_ON_CLOSE);
        showCartDialog.setSize(450, 200);

        Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
        int screenWidth = screenSize.width;
        int screenHeight = screenSize.height;
        int dialogWidth = showCartDialog.getWidth();
        int dialogHeight = showCartDialog.getHeight();
        int rightX = screenWidth - dialogWidth;
        int centerY = (screenHeight - dialogHeight) / 2;

        showCartDialog.setLocation(rightX, centerY);

        JPanel showCartPanel = new JPanel();
        showCartPanel.setLayout(new BorderLayout());
        showCartPanel.setBackground(Color.WHITE);

        JPanel toppingsPanel = new JPanel();
        toppingsPanel.setLayout(new GridLayout(0, 3));
        toppingsPanel.setBackground(Color.WHITE);

        int totalPrice = 0;
        float totalCalories = 0;

        JLabel yoghurtLabel = new JLabel("Yoghurt: " + (yoghurtSlot.getItem() != null ? yoghurtSlot.getItem().getItemName() : ""));
        JLabel yoghurtCalories = new JLabel("Calories: " + (yoghurtSlot.getItem() != null ? totalCalories += yoghurtSlot.getItem().getCalories() : ""));
        JLabel yoghurtPrice = new JLabel("Price: " + (yoghurtSlot.getItem() != null ? totalPrice += yoghurtSlot.getItem().getPrice() : ""));

        JLabel toppingLabel1 = new JLabel("Topping 1: " + (itemQueue[0] != null ? itemQueue[0].getItemName() : ""));
        JLabel caloriesLabel1 = new JLabel("Calories: " + (itemQueue[0] != null ? itemQueue[0].getCalories() : ""));
        JLabel priceLabel1 = new JLabel("Price: " + (itemQueue[0] != null ? itemQueue[0].getPrice() : ""));

        JLabel toppingLabel2 = new JLabel("Topping 2: " + (itemQueue[1] != null ? itemQueue[1].getItemName() : ""));
        JLabel caloriesLabel2 = new JLabel("Calories: " + (itemQueue[1] != null ? itemQueue[1].getCalories() : ""));
        JLabel priceLabel2 = new JLabel("Price: " + (itemQueue[1] != null ? itemQueue[1].getPrice() : ""));

        JLabel toppingLabel3 = new JLabel("Topping 3: " + (itemQueue[2] != null ? itemQueue[2].getItemName() : ""));
        JLabel caloriesLabel3 = new JLabel("Calories: " + (itemQueue[2] != null ? itemQueue[2].getCalories() : ""));
        JLabel priceLabel3 = new JLabel("Price: " + (itemQueue[2] != null ? itemQueue[2].getPrice() : ""));

        toppingsPanel.add(yoghurtLabel);
        toppingsPanel.add(yoghurtPrice);
        toppingsPanel.add(yoghurtCalories);
        toppingsPanel.add(toppingLabel1);
        toppingsPanel.add(priceLabel1);
        toppingsPanel.add(caloriesLabel1);
        toppingsPanel.add(toppingLabel2);
        toppingsPanel.add(priceLabel2);
        toppingsPanel.add(caloriesLabel2);
        toppingsPanel.add(toppingLabel3);
        toppingsPanel.add(priceLabel3);
        toppingsPanel.add(caloriesLabel3);

        for (Item item : itemQueue) {
            if (item != null) {
                totalPrice += item.getPrice();
                totalCalories += item.getCalories();
            }
        }

        JLabel totalLabel = new JLabel("                                                " + "Total Price:   " + totalPrice +
                "                   Total Calories: " + totalCalories + " cal");

        showCartPanel.add(toppingsPanel, BorderLayout.CENTER);
        showCartPanel.add(totalLabel, BorderLayout.PAGE_END);

        showCartDialog.add(showCartPanel);
        showCartDialog.setVisible(true);
    }



    public void showTotalSales(ArrayList<SalesInfo> salesInfoList) {
        if (salesInfoList == null || salesInfoList.isEmpty()) {
            showErrorDialog("No sales yet");
            return;
        }
        JDialog salesDialog = new JDialog();
        salesDialog.setTitle("Total Sales");
        salesDialog.setDefaultCloseOperation(JDialog.DISPOSE_ON_CLOSE);
        salesDialog.setSize(600, 400);
        salesDialog.setLocationRelativeTo(null);

        JPanel salesTablePanel = new JPanel();
        salesTablePanel.setLayout(new BorderLayout());

        String[] columnNames = {"Item Name", "Initial Stock ", "Current Stock", "Quantity Sold", "Unit Price", "Total Sales"};
        DefaultTableModel salesTableModel = new DefaultTableModel(null, columnNames);
        JTable salesTable = new JTable(salesTableModel);

        float totalSales = 0;

        for (SalesInfo salesInfo : salesInfoList) {
            String itemName = salesInfo.getItemName();
            int quantitySold = salesInfo.getQuantitySold();
            float unitPrice = salesInfo.getUnitPrice();
            float itemTotal = salesInfo.getItemTotal();
            int iniStock = salesInfo.getIniStock();
            int curStock = salesInfo.getCurStock();

            totalSales += itemTotal;
            salesTableModel.addRow(new Object[]{itemName, iniStock, curStock, quantitySold, unitPrice, itemTotal});
        }

        salesTableModel.addRow(new Object[]{"Total Sales:", null, null, null, null, totalSales});
        JScrollPane salesTableScrollPane = new JScrollPane(salesTable);
        salesTablePanel.add(salesTableScrollPane, BorderLayout.CENTER);
        salesDialog.add(salesTablePanel);
        salesDialog.setVisible(true);
    }

    public void showErrorDialog(String message) {
        JOptionPane.showMessageDialog(null, message, "Error", JOptionPane.ERROR_MESSAGE);
    }

    public void showWarningDialog(String message){
        JOptionPane.showMessageDialog(null, message, "Warning", JOptionPane.WARNING_MESSAGE);
    }
    public void showCongratulationsDialog(String message) {
        JOptionPane.showMessageDialog(null, message, "Congratulations!", JOptionPane.INFORMATION_MESSAGE);
    }

    public void showMessageDialog(String message){
        JOptionPane.showMessageDialog(null, message, "Message", JOptionPane.INFORMATION_MESSAGE);
    }

    public void showMessageDialogWithDelay(String message, int delayInMilliseconds) {
        closeCurrentDialog();

        Timer timer = new Timer(delayInMilliseconds, e -> {
            showMessageDialog(message);
            currentDialog = null;
        });
        timer.setRepeats(false);
        timer.start();
    }

    private void closeCurrentDialog() {
        if (currentDialog != null) {
            currentDialog.dispose();
        }
    }

    public void setContinueVendingMachineActionListener(ActionListener actionListener){
        this.continueVendingMachine.addActionListener(actionListener);
    }
    public void setHomeVendingButtonListener(ActionListener actionListener){
        this.homeVendingButton.addActionListener(actionListener);
    }

    public void setCreateVendingBackButtonListener(ActionListener actionListener){
        this.createVendingBackButton.addActionListener(actionListener);
    }

    public void setFeatureBackButtonListener(ActionListener actionListener){
        this.featureBackButton.addActionListener(actionListener);
    }

    public void setRegularMaintenanceFeatureBackButton(ActionListener actionListener){
        this.regularMaintenanceFeatureBackButton.addActionListener(actionListener);
    }

    public void setSpecialMaintenanceFeatureBackButton(ActionListener actionListener){
        this.specialMaintenanceFeatureBackButton.addActionListener(actionListener);
    }

    public void setRegularVendingFeatureBackButtonListener(ActionListener actionListener){
        this.regularVendingFeatureBackButton.addActionListener(actionListener);
    }

    public void setSpecialVendingFeatureBackButtonListener(ActionListener actionListener){
        this.specialVendingFeatureBackButton.addActionListener(actionListener);
    }

    public void setCreateVendingButtonListener(ActionListener actionListener){
        this.createVendingButton.addActionListener(actionListener);
    }


    public void setTestVendingButtonListener(ActionListener actionListener){
        this.testVendingButton.addActionListener(actionListener);
    }

    public void setshowVendingButtonListener(ActionListener actionListener){
        this.showVendingButton.addActionListener(actionListener);
    }

    public void setRegularVendingTypeButtonListener(ActionListener actionListener){
        regularVendingTypeButton.addActionListener(actionListener);
    }

    public void setSpecialVendingTypeButtonListener(ActionListener actionListener){
        this.specialVendingTypeButton.addActionListener(actionListener);
    }

    public void setVendingRegularInfoButtonListener(ActionListener actionListener) {
        this.vendingRegularInfoButton.addActionListener(actionListener);
    }

    public void setVendingSpecialInfoButtonListener(ActionListener actionListener) {
        this.vendingSpecialInfoButton.addActionListener(actionListener);
    }

    public void setTestVendingNumButtonListener(ActionListener actionListener){
        this.enterVendingNumButton.addActionListener(actionListener);
    }

    public void setMaintenanceFeatureButtonListener(ActionListener actionListener){
        this.maintenanceFeatureButton.addActionListener(actionListener);
    }

    public void setVendingFeatureButtonListener(ActionListener actionListener){
        this.vendingFeatureButton.addActionListener(actionListener);
    }

    public void setRegisterRegularItemButtonListener(ActionListener actionListener) {
        this.registerRegularItemButton.addActionListener(actionListener);
    }

    public void setRegisterItemInfoButtonListener(ActionListener actionListener) {
        this.registerItemInfoButton.addActionListener(actionListener);
    }


    public void setEditRegularItemButtonListener(ActionListener actionListener){
        this.editRegularItemButton.addActionListener(actionListener);
    }

    public void setRegisterSpecialItemButtonListener(ActionListener actionListener){
        this.registerSpecialItemButton.addActionListener(actionListener);
    }

    public void setEditSpecialItemButtonListener(ActionListener actionListener){
        this.editSpecialItemButton.addActionListener(actionListener);
    }

    public void setEnterItemNameToEditRegularButton(ActionListener actionListener){
        this.enterItemNameToEditRegularButton.addActionListener(actionListener);
    }

    public void setEnterItemNameToEditSpecialButton(ActionListener actionListener){
        this.enterItemNameToEditSpecialButton.addActionListener(actionListener);
    }

    public void enterSauceNameToEditSpecialEnterButtonListener(ActionListener actionListener){
        this.enterSauceNameToEditSpecialEnterButton.addActionListener(actionListener);
    }
    public void setDisplaySauceInSlotButtonListener(ActionListener actionListener){
        this.displaySauceInSlotButton.addActionListener(actionListener);
    }

    public void setRestockItemButtonListener(ActionListener actionListener){
        this.restockButton.addActionListener(actionListener);
    }

    public void setRestockAddButtonListener(ActionListener actionListener){
        this.restockAddButton.addActionListener(actionListener);
    }
    public void setSetNewPriceButtonListener(ActionListener actionListener){
        this.setNewPriceButton.addActionListener(actionListener);
    }

    public void setNewPriceConfirmButtonListener(ActionListener actionListener){
        this.newPriceConfirmButton.addActionListener(actionListener);
    }
    public void setEmptySlotButtonListener(ActionListener actionListener){
        this.emptySlotButton.addActionListener(actionListener);
    }

    public void setDisplayItemInSlotButtonListener(ActionListener actionListener){
        this.displayItemInSlotButton.addActionListener(actionListener);
    }


    public void setDisplayVaultCashButtonListener(ActionListener actionListener){
        this.displayVaultCashButton.addActionListener(actionListener);
    }
    public void setReplenishVaultButtonListener(ActionListener actionListener){
        this.replenishVaultButton.addActionListener(actionListener);
    }


    public void setTransactionSummaryButtonListener(ActionListener actionListener){
        this.transactionSummaryButton.addActionListener(actionListener);
    }

    public void setCollectVaultMoneyButtonListener(ActionListener actionListener) {
        this.collectVaultMoneyButton.addActionListener(actionListener);
    }

    public void setInsertCashButtonListener(ActionListener actionListener) {
        this.insertCashButton.addActionListener(actionListener);
    }

    public void setDenomination1ButtonListener(ActionListener actionListener) {
        this.denomination1Button.addActionListener(actionListener);
    }

    public void setDenomination5ButtonListener(ActionListener actionListener) {
        this.denomination5Button.addActionListener(actionListener);
    }

    public void setDenomination10ButtonListener(ActionListener actionListener) {
        this.denomination10Button.addActionListener(actionListener);
    }

    public void setDenomination20ButtonListener(ActionListener actionListener) {
        this.denomination20Button.addActionListener(actionListener);
    }

    public void setDenomination50ButtonListener(ActionListener actionListener) {
        this.denomination50Button.addActionListener(actionListener);
    }

    public void setDenomination100ButtonListener(ActionListener actionListener) {
        this.denomination100Button.addActionListener(actionListener);
    }

    public void setDenomination200ButtonListener(ActionListener actionListener) {
        this.denomination200Button.addActionListener(actionListener);
    }

    public void setDenomination500ButtonListener(ActionListener actionListener) {
        this.denomination500Button.addActionListener(actionListener);
    }

    public void setDenomination1000ButtonListener(ActionListener actionListener) {
        this.denomination1000Button.addActionListener(actionListener);
    }

    public void setInsertCashDoneButtonListener(ActionListener actionListener) {
        this.insertCashDoneButton.addActionListener(actionListener);
    }
    public void setCheckoutItemButtonListener(ActionListener actionListener) {
        this.checkoutItemButton.addActionListener(actionListener);
    }


    public void setDispenseMoneyButtonListener(ActionListener actionListener) {
        this.dispenseMoneyButton.addActionListener(actionListener);
    }

    public void setCheckoutEnterButtonListener(ActionListener actionListener){
        this.checkoutEnterButton.addActionListener(actionListener);
    }

    public void registerSauceButtonListener(ActionListener actionListener){
        this.registerSauceButton.addActionListener(actionListener);
    }

    public void setEditSauceButtonListener(ActionListener actionListener){
        this.editSauceButton.addActionListener(actionListener);
    }
    public void setAddItemToCartButtonListener(ActionListener actionListener){
        this.addItemToCartButton.addActionListener(actionListener);
    }

    public void setAddItemToCartEnterButtonListener(ActionListener actionListener){
        this.addItemToCartEnterButton.addActionListener(actionListener);
    }

    public void setAddSauceToCartButtonListener(ActionListener actionListener) {
        this.addSauceToCartButton.addActionListener(actionListener);
    }

    public void setAddSauceToCartEnterButtonListener(ActionListener actionListener) {
        this.addSauceToCartEnterButton.addActionListener(actionListener);
    }

    public void setRegisterSauceInfoButtonListener(ActionListener actionListener){
        this.registerSauceInfoButton.addActionListener(actionListener);
    }

    public void setRestockSauceButtonListener(ActionListener actionListener){
        this.restockSauceButton.addActionListener(actionListener);
    }

    public void setNewPriceSauceButtonListener(ActionListener actionListener){
        this.setNewPriceSauceButton.addActionListener(actionListener);
    }

    public void setEmptySlotSauceButtonListenerActionListener(ActionListener actionListener){
        this.emptySlotSauceButton.addActionListener(actionListener);
    }

    public void setRestockAddSauceEnterButtonActionListener(ActionListener actionListener){
        this.restockAddSauceEnterButton.addActionListener(actionListener);
    }

    public void setNewSaucePriceConfirmButton(ActionListener actionListener){
        this.newSaucePriceConfirmButton.addActionListener(actionListener);
    }

    public void setCheckoutMadeProductButtonListener(ActionListener actionListener){
        this.checkoutMadeProductButton.addActionListener(actionListener);
    }

    public void setRefillYoghurtButtonListener(ActionListener actionListener){
        this.refillYoghurtButton.addActionListener(actionListener);
    }

    public void setShowYoghurtQuantityButtonListener(ActionListener actionListener){
        this.showYoghurtQuantityButton.addActionListener(actionListener);
    }

    public void setDisplayCartButtonActionListener(ActionListener actionListener){
        this.displayCartButton.addActionListener(actionListener);
    }

    public void setEmptyCartButtonActionListener(ActionListener actionListener){
        this.emptyCartButton.addActionListener(actionListener);
    }
    public String getRegularVendingNameTextField() {
        return regularVendingNameTextField.getText();
    }

    public String getRegularSlotCountTextField() {
        return regularSlotCountTextField.getText();
    }

    public String getRegularSlotCapacityTextField() {
        return regularSlotCapacityTextField.getText();
    }

    public String getSpecialVendingNameTextField() {
        return specialVendingNameTextField.getText();
    }

    public String getSpecialSlotCapacityTextField() {
        return specialSlotCapacityTextField.getText();
    }

    public String getSpecialSlotSauceCapacityTextField() {
        return specialSlotSauceCapacityTextField.getText();
    }

    public String getVendingNumTextField(){
        return vendingNumTextField.getText();
    }

    public String getItemNameTextField(){
        return itemNameTextField.getText();
    }

    public String getItemPriceTextField(){
        return itemPriceTextField.getText();
    }

    public String getItemCaloriesTextField(){
        return itemCaloriesTextField.getText();
    }

    public String getItemDescriptionTextField(){
        return itemDescriptionTextField.getText();
    }

    public String getItemQuantityTextField(){
        return itemQuantityTextField.getText();
    }

    public String getItemNameToEditTextField(){
        return itemNameToEditTextField.getText();
    }

    public String getRestockQuantityTextField(){
        return quantityToAddTextField.getText();
    }

    public String getNewPriceTextField(){
        return newPriceTextField.getText();
    }

    public String getSlotNumToCheckoutTextField(){
        return slotNumToCheckoutTextField.getText();
    }

    public String getSlotNumToAddToCartItemTextField(){
        return slotNumToAddToCartItemTextField.getText();
    }
    public String getSlotNumToAddToCartSauceTextField(){
        return slotNumToAddToCartSauceTextField.getText();
    }

    public String getSauceNameTextField() {
        return sauceNameTextField.getText();
    }

    public String getSaucePriceTextField() {
        return saucePriceTextField.getText();
    }

    public String getSauceCaloriesTextField() {
        return sauceCaloriesTextField.getText();
    }

    public String getSauceDescriptionTextField() {
        return sauceDescriptionTextField.getText();
    }

    public String getSauceQuantityTextField() {
        return sauceQuantityTextField.getText();
    }

    public String getSauceNameToEditTextField(){
        return sauceNameToEditTextField.getText();
    }

    public String getQuantityToAddSauceTextField(){
        return quantityToAddSauceTextField.getText();
    }

    public String getNewSaucePriceTextField(){
        return newPriceSauceTextField.getText();
    }
}
