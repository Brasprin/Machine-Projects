/**
 * A class representing information about a sales transaction for a particular item.
 * It stores details such as the item name, initial stock, current stock, quantity sold,
 * unit price, and item total.
 */
public class SalesInfo {
    private final String ITEMNAME;
    private final int INISTOCK;
    private final int CURSTOCK;
    private final int QUANTITYSOLD;
    private final float UNITPRICE;
    private final float ITEMTOTAL;

    /**
     * Constructs a new SalesInfo object with the provided details.
     *
     * @param itemName     The name of the item being sold.
     * @param iniStock     The initial stock quantity of the item before the sales
     *                     transaction.
     * @param curStock     The current stock quantity of the item after the sales
     *                     transaction.
     * @param quantitySold The quantity of the item sold in the sales transaction.
     * @param unitPrice    The unit price of the item.
     * @param itemTotal    The total value of the items sold (quantitySold *
     *                     unitPrice).
     */
    public SalesInfo(String itemName, int iniStock, int curStock, int quantitySold, float unitPrice, float itemTotal) {
        this.ITEMNAME = itemName;
        this.INISTOCK = iniStock;
        this.CURSTOCK = curStock;
        this.QUANTITYSOLD = quantitySold;
        this.UNITPRICE = unitPrice;
        this.ITEMTOTAL = itemTotal;
    }

    /**
     * Returns the name of the item.
     *
     * @return The name of the item.
     */
    public String getItemName() {
        return ITEMNAME;
    }

    /**
     * Returns the unit price of the item.
     *
     * @return The unit price of the item.
     */
    public float getUnitPrice() {
        return UNITPRICE;
    }

    /**
     * Returns the quantity of the item sold in the sales transaction.
     *
     * @return The quantity of the item sold.
     */
    public int getQuantitySold() {
        return QUANTITYSOLD;
    }

    /**
     * Returns the total value of the items sold in the sales transaction
     * (quantitySold * unitPrice).
     *
     * @return The total value of the items sold.
     */
    public float getItemTotal() {
        return ITEMTOTAL;
    }

    /**
     * Returns the initial stock quantity of the item before the sales transaction.
     *
     * @return The initial stock quantity of the item.
     */
    public int getIniStock() {
        return INISTOCK;
    }

    /**
     * Returns the current stock quantity of the item after the sales transaction.
     *
     * @return The current stock quantity of the item.
     */
    public int getCurStock() {
        return CURSTOCK;
    }
}
