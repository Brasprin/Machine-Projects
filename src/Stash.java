/**
 * A class representing a stash that temporarily holds cash inserted by the user.
 * It extends the {@link CashVault} class and inherits its properties and methods.
 */
public class Stash extends CashVault {

    /**
     * Constructs a new empty Stash object.
     */
    public Stash() {
        super();
    }

    /**
     * Withdraws all the cash from the stash.
     *
     * @return true if the stash is not empty and the withdrawal is successful,
     *         false otherwise.
     */
    public boolean withdrawEverything() {
        if (isEmpty())
            return false;
        else {
            for (int denomination : moneyList.keySet())
                moneyList.get(denomination).clear();
            return true;
        }
    }

    /**
     * Checks if the stash is empty (i.e., the balance is zero).
     *
     * @return true if the stash is empty, false otherwise.
     */
    private boolean isEmpty() {
        return getBalance() == 0;
    }
}
