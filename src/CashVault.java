import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * The CashVault class represents a cash vault that can store money of different
 * denominations.
 * It allows depositing and withdrawing money and provides methods to retrieve
 * the total balance and the quantity of money for each denomination stored in the vault.
 */
public class CashVault {
    /**
     * A LinkedHashMap that associates an Integer (denomination) with an ArrayList
     * of Money objects.
     * Each key in the LinkedHashMap represents a denomination, and the corresponding value
     * is an ArrayList of Money objects representing money of that denomination.
     */
    protected LinkedHashMap<Integer, ArrayList<Money>> moneyList;

    /**
     * Constructs a new CashVault object.
     * The cash vault is initialized with empty ArrayLists for each denomination
     * (1, 5, 10, 20, 50, 100, 200, 500, and 1000).
     */
    public CashVault() {
        moneyList = new LinkedHashMap<>();
        moneyList.put(1, new ArrayList<>());
        moneyList.put(5, new ArrayList<>());
        moneyList.put(10, new ArrayList<>());
        moneyList.put(20, new ArrayList<>());
        moneyList.put(50, new ArrayList<>());
        moneyList.put(100, new ArrayList<>());
        moneyList.put(200, new ArrayList<>());
        moneyList.put(500, new ArrayList<>());
        moneyList.put(1000, new ArrayList<>());
    }

    /**
     * Deposits money of the specified denomination into the cash vault.
     *
     * @param denomination The denomination of the money to deposit.
     */

    public void deposit(int denomination) {
        Money money = new Money(denomination);
        moneyList.get(denomination).add(money);
    }

    /**
     * Withdraws money of the specified denomination from the cash vault.
     * The most recently deposited money of the specified denomination is removed.
     *
     * @param denomination The denomination of the money to withdraw.
     */
    public void withdraw(int denomination) {
        int size = moneyList.get(denomination).size();
        moneyList.get(denomination).remove(size - 1);
    }

    /**
     * Calculates and returns the total balance in the cash vault.
     * The balance is the sum of all denominations multiplied by their respective
     * quantities.
     *
     * @return The total balance in the cash vault.
     */
    public int getBalance() {
        int balance = 0;

        for (Map.Entry<Integer, ArrayList<Money>> entry : moneyList.entrySet()) {
            int denomination = entry.getKey();
            int quantity = entry.getValue().size();
            balance += denomination * quantity;
        }
        return balance;
    }

    /**
     * Returns the quantity of money present in the cash vault for a specific
     * denomination.
     *
     * @param denomination The denomination of the money to retrieve the quantity
     *                     for.
     * @return The quantity of money for the specified denomination in the cash
     *         vault.
     */
    public int getQuantityByDenomination(int denomination) {return moneyList.get(denomination).size();}

    /**
     * Returns the entire moneyList, providing access to the LinkedHashMap that
     * holds the money stored in the cash vault.
     *
     * @return The LinkedHashMap representing the money stored in the cash vault.
     */
    public LinkedHashMap<Integer, ArrayList<Money>> getMoneyList() {
        return moneyList;
    }
}
