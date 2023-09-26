/**
 * Item class is the item to be sold in the vending machine object. An item
 * consists of a name,
 * price, calories, and description
 */
public class Item {

    private final String ITEMNAME;
    private int price;
    private final float CALORIES;
    private String description;

    /**
     * Creates Item object given the itemName, price, calories, and a short
     * description
     * 
     * @param itemName    Name of the item
     * @param price       Price of the item
     * @param calories    Calorie count of the item
     * @param description Short description for the item
     */
    public Item(String itemName, int price, float calories, String description) {
        ITEMNAME = itemName;
        this.price = price;
        CALORIES = calories;
        this.description = description;
    }

    /**
     * This method gets the item's price
     * 
     * @return the item's current price
     */
    public int getPrice() {
        return price;
    }

    /**
     * This method get's the item's name
     * 
     * @return the item's name
     */
    public String getItemName() {
        return ITEMNAME;
    }

    /**
     * This method gets the item's calorie count
     * 
     * @return the item's calories
     */
    public float getCalories() {
        return CALORIES;
    }

    /**
     * This method gets the short description of the item
     * 
     * @return item's description
     */
    public String getDescription() {
        return description;
    }

    /**
     * Updates the item's current price to the given price
     * 
     * @param newPrice new current price
     */
    public void setNewPrice(int newPrice) {
        price = newPrice;
    }

}
