/**
 * The Money class represents an amount of money object with a specific float value.
 * It allows accessing and retrieving the amount of money it represents.
 */
public class Money {
    /**
     * The amount of money represented by this Money object.
     */
    private final float AMOUNT;

    /**
     * Constructs a new Money object with the specified amount.
     *
     * @param amount The amount of money to be represented by this Money object.
     */
    public Money(float amount) {
        this.AMOUNT = amount;
    }

    /**
     * Returns the amount of money represented by this Money object.
     *
     * @return The amount of money as a float value.
     */
    public float getAMOUNT() {
        return AMOUNT;
    }
}