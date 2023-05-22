/*********************************************************************************************************
This is to certify that this project is my own work, based on my personal efforts in studying and applying
the concepts learned. I have constructed the functions and their respective algorithms and corresponding
code by myself. The program was run, tested, and debugged by my own efforts. I further certify that I have
not copied in part or whole or otherwise plagiarized the work of other students and/or persons.

ANDREI TAMSE, DLSU ID# 12277711
*********************************************************************************************************/
// Version 12

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// CONSTANTS
#define MIN 11
#define LOW 16
#define MIDDLE 21
#define HIGHEST 31
#define MAX 100

// typedef char based on their string capacity.
// Ex. str10 = char [11];
typedef char str10[MIN];
typedef char str15[LOW];
typedef char str20[MIDDLE];
typedef char str30[HIGHEST];

// Struct itemType to store information of the items listed by the users.
typedef struct itemTag
{
    long sellerID;
    long productID;
    str15 itemName;
    str15 category;
    str30 description;
    int quantity;
    float price;
} itemType;

// Struct infoType to store information of the users.
typedef struct infoTag
{
    long userID;
    str10 password;
    str20 name;
    str30 address;
    int productCount;
    long contact;
    itemType item[20];
    itemType cart[11];
    int cartCount;
} infoType;

typedef struct itemTrackerTag
{
    itemType allProductID[2000];
    int allProductCount;
} itemTrackerType;

typedef struct dateTag
{
    int month;
    int day;
    int year;
} dateType;

typedef struct transactionTag
{
    dateType date;
    itemType item[5];
    long buyerID;
    long sellerID;
    float totalPrice;
} transactionType;

// Function prototypes.
void getString(char str[], int length);
int mode();
void sort_userID(infoType user[], int numberOfUser);
int binarySearch_user(infoType user[], int numberOfUser, long key);
void validate_userID(infoType user[], int newUserIndex, long *key);
void register_user(infoType user[], int *numberOfUser);
void validate_newProductID(infoType user[], itemTrackerType itemTracker, long *newProductID);
void register_productID(infoType user[], itemTrackerType *itemTracker);
void sort_userProductID(infoType user[]);
int binarySearch_productID(infoType user[], long key);
void sort_allProductID(itemTrackerType *itemTracker);
int binarySearch_allProductID(itemTrackerType itemTracker, long key);
void edit_stock(infoType user[], itemTrackerType *itemTracker);
void show_product(infoType user[]);
void show_lowProductStock(infoType user[]);
void sell_menu(infoType user[], itemTrackerType *itemTracker);
void view_allProduct(infoType user[], int numberOfUser);
void show_itemCatalog(infoType user[], int i, int j, int *header);
void view_specificSellerProduct(infoType user[], int numberOfUser);
void view__productCategory(infoType user[], int numberOfUser);
void view_specificProductName(infoType user[], int numberOfUser);
void add_toCart(infoType user[], itemTrackerType itemTracker, int currentUserIndex, int numberOfUser);
void show_cart(infoType user[], int currentUserIndex);
void remove_sellerItem(infoType user[], int currentUserIndex);
void remove_specificItem(infoType user[], int currentUserIndex);
void edit_cartQuantity(infoType user[], itemTrackerType itemTracker, int currentUserIndex);
void edit_cart(infoType user[], itemTrackerType itemTracker, int currentUserIndex);
void validate_checkOut(infoType user[], itemTrackerType itemTracker, int currentUserIndex);
void checkOut_allItem(infoType user[], itemTrackerType *itemTracker,
                      transactionType *transaction, int currentUserIndex, int numberOfUser);
void checkOut_specificSeller(infoType user[], itemTrackerType *itemTracker,
                             transactionType *transaction, int currentUserIndex, int numberOfUser);
void checkOut_specificItem(infoType user[], itemTrackerType *itemTracker,
                           transactionType *transaction, int currentUserIndex, int numberOfUser);
void checkOut_menu(infoType user[], itemTrackerType *itemTracker,
                   transactionType *transaction, int currentUserIndex, int numberOfUser, int read);
void buy_menu(infoType user[], itemTrackerType *itemTracker,
              transactionType *transaction, int currentUserIndex, int numberOfUser);
void user_menu(infoType user[], itemTrackerType *itemTracker,
               transactionType *transaction, int numberOfUser);
int readTextFile_cart(infoType user[], int currentUserIndex);
void writeTextFile_cart(infoType user[], int currentUserIndex);
void show_allSeller(infoType user[], int numberOfUser);
void get_dateRange(dateType *startDate, dateType *endDate);
double total_salesDuration(transactionType transaction);
void show_shopaholics(infoType user[], transactionType transaction, int numberOfUser);
void admin_menu(infoType user[], int numberOfUser);
void readFile_user(infoType user[], int *numberOfUser);
void writeFile_user(infoType user[], int numberOfUser);
void readFile_product(infoType user[], itemTrackerType *itemTracker, int numberOfUser);
void writeFile_product(itemTrackerType itemTracker, int numberOfUser);
void writeBinaryFIle_transaction(transactionType transaction);

/*  Function "getString" reads a string input from the user, including spaces, and
    automatically terminates the string with a null byte after the specified length.
    Any excess input beyond the specified length is discarded.

    @param str[] - Updates user array input.
    @param length - Indicates the maximum length of the string input.
*/
void getString(char str[], int length)
{
    int i = 0;
    char charInput;
    char dummy = ' ';

    scanf("\n");
    do
    {
        scanf("%c", &charInput);
        str[i] = charInput;
        i++;
    } while (i <= length && charInput != '\n');

    if (strlen(str) > length)
    {
        printf("Warning: input truncated to %d characters.\n", length - 1);
        str[length - 1] = '\0';

        while (dummy != '\n' && dummy != EOF)
            scanf("%c", &dummy); // Reads the remaining excess character as dummy variable.
    }
    else
        str[i - 1] = '\0';
}

/*  Function "mode" presents the available services of the program and prompts the
    user to select a mode.

    @return - Returns the mode chosen by the User.
*/
int mode()
{
    int choice = 0;

    do
    {

        printf("\nSelect services:\n");
        printf("[1] Register\n");
        printf("[2] User Menu\n");
        printf("[3] Admin Menu\n");
        printf("[4] Exit\n");
        printf("--------------------------\n");
        printf("Choice: ");
        scanf("%d", &choice);
        printf("\n\n");

        if (choice < 1 || choice > 4)
            printf("INVALID INPUT");

        // Continues the loop if service chosen is not valid and exit the loop if valid.
    } while (choice < 1 || choice > 4);

    return choice;
}

/* -----------------------------USER FUNCTIONS----------------------------------- */

/*  Function "sort_userID" sorts the userID of the users numerically

    @param user[] -  An array of infoType structs representing information of the user.
    @param numberOfUser - Number of users registered.
*/
void sort_userID(infoType user[], int numberOfUser)
{
    int i, j;
    infoType temp;

    for (i = 0; i < numberOfUser; i++)
    {
        temp = user[i];
        j = i - 1; // 'j' is use as index to compare element on the left of the current element 'i'.

        while (j >= 0 && user[j].userID > temp.userID)
        {
            // Moves the previous element one position to the right.
            user[j + 1] = user[j];
            j--; // Decrement index j to compare its element to the left.
        }
        // Insert the current element to the right to be in a sorted position.
        user[j + 1] = temp;
    }
}

/*   Function "binarySearch_user" performs a search for a user with a specific "UserID"
    value within an existing array of "UserIDs" using the binary search algorithm.
    If the "UserID" is found in the array, the function returns the index of the
    found value. Otherwise, it returns -1

    @param user[] -  An array of infoType structs representing information of the user.
    @param numberOfUser - Number of users registered.
    @param key - Value that needs to be check.
*/
int binarySearch_user(infoType user[], int numberOfUser, long key)
{
    int start = 0, middle = 0, end = numberOfUser - 1;
    int found = -1;

    sort_userID(user, numberOfUser);
    // Continues the loop until start overlaps end variable and found is equal to 0.
    while (start <= end && found == -1)
    {

        middle = (start + end) / 2;
        if (key == user[middle].userID)
            found = middle;
        else if (key > user[middle].userID)
            start = middle + 1;
        else
            end = middle - 1;
    }
    return found;
}

/*  Function "validate_userID" checks if new UserID is already taken, If yes, it will
    ask user for another userID until userID is unique.

    @param user[] -  An array of infoType structs representing information of the user.
    @param numberOfUser - Number of users registered.
    @param *key - Value that needs to be check, and used to pass the new userID
    to the function if the initially entered UserID is already taken.
*/
void validate_userID(infoType user[], int numberOfUser, long *key)
{
    int found;

    // 0 invalid userID
    if (*key == 0)
        while (*key == 0)
        {
            printf("0 is Invalid userID.\n");
            printf("New (10) digit UserID: ");
            scanf("%ld", key);
        }
    else
        do
        {
            found = binarySearch_user(user, numberOfUser, *key);
            if (found != -1)
            {

                printf("userID %ld is already taken.\n", *key);
                // ask for new 10 digit userID
                printf("New (10) digit UserID: ");
                scanf("%ld", key);
            }

        } while (found != -1);
}

/*  Function "register_user" used to create new account by asking data from the
    new User. This function also updates the "numberOfUser" in the system.

    @param user[] -  An array of infoType structs representing information of the user..
    @param *numberOfUser - Number of users registered and updates the new count
    of users if user registered sucessfully.
*/
void register_user(infoType user[], int *numberOfUser)
{
    int i; // New user index will always place at last index at default.
    int choice;

    // Do while loop if the users want to change information and terminates if confirmed.
    do
    {
        i = *numberOfUser;

        printf("Own (10) digit UserID: ");
        scanf("%10ld", &user[i].userID);
        printf("New password: ");
        getString(user[i].password, MIN);
        printf("Contact Number: +63 ");
        scanf("%10ld", &user[i].contact);
        printf("Name: ");
        getString(user[i].name, MIDDLE);
        printf("Address: ");
        getString(user[i].address, HIGHEST);

        validate_userID(user, *numberOfUser, &user[i].userID); // Validate userID input

        printf("Confirm Information:");
        printf("\nUserID: %ld", user[i].userID);
        printf("\nPassword: %s", user[i].password);
        printf("\nContact Number: +63 %ld", user[i].contact);
        printf("\nName:  %s", user[i].name);
        printf("\nAddress: %s", user[i].address);
        printf("\n\n\nEnter [1] to confirm. ");
        printf("\nEnter [2] to reset. ");
        printf("\n-------------------------\n");
        printf("Choice: ");
        scanf("%d", &choice);

        if (choice == 1)
        {
            printf("\n\nCONGRATULATIONS! You are now registered!");
            (*numberOfUser)++; // Increment newUserIndex for next user
        }

        // Continue the loop if user wants to reset information
    } while (choice == 2);
}

/* -----------------------------PRODUCT FUNCTIONS----------------------------------- */

/*  Function "validate_newProductID" uses  binary search algorithm to determine whether a
    newly entered productID has already been used. If the productID is already taken, the
    function prompts the user to input a different productID until a unique one is provided.

    @param user[] -  An array of infoType structs representing information of the user.
    @param itemTracker - Struct arrays of allProducts registered in the system.
    @param *newProductID - Used to pass the new input productID to the function if
    the initially entered productID is already taken
*/
void validate_newProductID(infoType user[], itemTrackerType itemTracker, long *newProductID)
{
    int i = itemTracker.allProductCount;
    int start, middle, end;
    int found = 0;

    sort_allProductID(&itemTracker);
    do
    {
        // Reset counts
        found = 0;
        start = 0;
        end = i - 1;
        // Continues the loop until start overlaps end variable.
        while (start <= end && found == 0)
        {
            middle = (start + end) / 2;

            if (*newProductID == itemTracker.allProductID[middle].productID)
                found = 1;
            else if (*newProductID > itemTracker.allProductID[middle].productID)
                start = middle + 1;
            else
                end = middle - 1;
        }
        // If found, ask user for another input and recheck it again.
        if (found == 1)
        {

            printf("productID %ld is already taken.\n", *newProductID);
            printf("New productID: ");
            scanf("%10ld", newProductID);
            getchar();
        }
        else
            found = 0;
    } while (found == 1); // use this function to pereven morethan 20 items
}

/*  Function "register_productID" use to list new productID by asking data
    from the current user. That also updates the "itemTracker"

    @param user[] -  An array of infoType structs representing information of the user.
    @param *itemTracker - Struct of allProducts registered in the system. That
    also updates the "itemTracker" (allProductCount and allProduct) in the system.
*/
void register_productID(infoType user[], itemTrackerType *itemTracker)
{
    // Limit product to sell to 20.
    if (user->productCount < 20)
    {
        int i = user->productCount;
        int j = itemTracker->allProductCount;

        printf("Enter productID: ");
        scanf("%10ld", &user->item[i].productID);
        printf("Product name: ");
        getString(user->item[i].itemName, LOW);
        printf("Product category: ");
        getString(user->item[i].category, LOW);
        printf("Product price: ");
        scanf("%f", &user->item[i].price);
        printf("Product quantity: ");
        scanf("%d", &user->item[i].quantity);
        printf("Product description: ");
        getString(user->item[i].description, HIGHEST);

        validate_newProductID(user, *itemTracker, &user->item[i].productID);

        // assign newProductID to allProductID
        itemTracker->allProductID[j].productID = user->item[i].productID;
        itemTracker->allProductID[j].sellerID = user->userID;
        strcpy(itemTracker->allProductID[j].itemName, user->item[i].itemName);
        strcpy(itemTracker->allProductID[j].category, user->item[i].category);
        strcpy(itemTracker->allProductID[j].description, user->item[i].description);
        itemTracker->allProductID[j].quantity = user->item[i].quantity;
        itemTracker->allProductID[j].price = user->item[i].price;
        user->productCount++;
        itemTracker->allProductCount++;
    }
    else
        printf("To ensure fairness for all users, we have a limit of 20 items per user.");
}

/*  Function "sort_userProductID" function sorts each user's productIDs in numerical
    order that are listed in the system.

    @param user[] - Struct arrays of information of the user.
*/
void sort_userProductID(infoType user[])
{
    int i = 0, j;
    itemType temp;

    for (i = 0; i < user->productCount; i++)
    {
        temp = user->item[i];
        j = i - 1; // 'i' is use as index to compare element on the left of the current element 'i'.

        while (j >= 0 && user->item[j].productID > temp.productID)
        {
            // Moves the previous element one position to the right.
            user->item[j + 1] = user->item[j];
            j--; // Decrement index j to compare its element to the left.
        }
        // Insert the current element to the right to be in a sorted position.
        user->item[j + 1] = temp;
    }
}

/*  Function "binarySearch_productID" performs a search for a user with a specific
    "productID" within the existing array of user's productID using the binary search
    algorithm. If the "productID" is found in the array, the function returns the index
    of the found value. Otherwise, it returns -1

    @param user[] - An array of infoType structs representing information of the user.
    @param key - ProductID that needs to be check.
*/
int binarySearch_productID(infoType user[], long key)
{
    int start, middle, end;
    int found = -1;

    start = 0;
    end = user->productCount - 1;

    while (start <= end && found == -1)
    {
        middle = (start + end) / 2;

        if (key == user->item[middle].productID)
            found = middle;
        else if (key > user->item[middle].productID)
            start = middle + 1;
        else
            end = middle - 1;
    }
    return found;
}

/*  Function "sort_allProductID" sorts ALLPRODUCTID numerically that is registered
    in the system.

    @param *itemTracker - Struct arrays of allProducts registered in the system.
*/
void sort_allProductID(itemTrackerType *itemTracker)
{
    int i, j;
    itemType temp;

    // Insertion sort to sort the 'productID' and continues the loop until the last user.
    for (i = 1; i < itemTracker->allProductCount; i++)
    {
        temp = itemTracker->allProductID[i];
        j = i - 1; // 'j' is use as index to compare element on the left of the current element 'i'.
        while (j >= 0 && itemTracker->allProductID[j].productID > temp.productID)
        {
            // Moves the previous element one position to the right.
            itemTracker->allProductID[j + 1] = itemTracker->allProductID[j];
            j--; // Decrement index j to compare its element to the left.
        }
        // Insert the current element to the right to be in a sorted position.
        itemTracker->allProductID[j + 1] = temp;
    }
}

/*  Function "binarySearch_allProductID" performs a search of a specific "productID"
    inside  the struct of allProductID that has the copy of all products that are
    in the market. This function returns -1 if the specific "productID" is not in
    the list and return the index of the found productID when found.

    @param itemTracker - itemTrackerType struct representing all of the product information in the system.
    @param key -  ProductID that needs to be check.
*/
int binarySearch_allProductID(itemTrackerType itemTracker, long key)
{
    int start, middle, end;
    int found = -1;

    start = 0;
    end = itemTracker.allProductCount - 1;

    sort_allProductID(&itemTracker);
    while (start <= end && found == -1)
    {
        middle = (start + end) / 2;
        if (key == itemTracker.allProductID[middle].productID)
            found = middle;
        else if (key > itemTracker.allProductID[middle].productID)
            start = middle + 1;
        else
            end = middle - 1;
    }

    return found;
}

/*  Function "edit_stock" allows the seller to edit the stock of a product, including its quantity,
    price, name, category, and description. It displays a menu of options to choose from and updates the
    product information both in the user's array and in the allProductID array of the itemTrackerType struct.

    @param user[] - An array of infoType structs representing the seller's products.
    @param *itemTracker - A pointer to an itemTrackerType struct that keeps track of
    and update all products in the system.
*/

void edit_stock(infoType user[], itemTrackerType *itemTracker)
{
    int productEdit;
    int found;
    int choice = 0;
    int quantity;
    int allProductIndex;

    show_product(user);

    printf("Enter productID to be edited: ");
    scanf("%d", &productEdit);
    // If product to be edit is found in the user, it will enter the editing algorithm
    found = binarySearch_productID(user, productEdit);
    allProductIndex = binarySearch_allProductID(*itemTracker, productEdit);
    while (found != -1 && choice != 6)
    {
        printf("NOW EDITING PRODUCTID %d", productEdit);
        printf("\nSelect edit options:\n");
        printf("[1] Replenish\n");
        printf("[2] Change Price\n");
        printf("[3] Change Item Name\n");
        printf("[4] Change Category\n");
        printf("[5] Change Description\n");
        printf("[6] Finish Editing\n");
        printf("--------------------------------\n");
        printf("Choice: ");
        scanf("%d", &choice);

        if (choice == 1)
        {
            printf("Quantity to be added: ");
            scanf("%d", &quantity);
            user->item[found].quantity += quantity;
            itemTracker->allProductID[allProductIndex].quantity += quantity;
            show_product(user);
        }
        else if (choice == 2)
        {
            printf("Enter new price: ");
            scanf("%f", &user->item[found].price);
            itemTracker->allProductID[allProductIndex].price = user->item[found].price;
            show_product(user);
        }
        else if (choice == 3)
        {
            printf("Enter new item name: ");
            getString(user->item[found].itemName, LOW);
            strcpy(itemTracker->allProductID[allProductIndex].itemName,
                   user->item[found].itemName);
            show_product(user);
        }
        else if (choice == 4)
        {
            printf("Enter new category: ");
            getString(user->item[found].category, LOW);
            strcpy(itemTracker->allProductID[allProductIndex].category,
                   user->item[found].category);
            show_product(user);
        }
        else if (choice == 5)
        {
            printf("Enter new description: ");
            getString(user->item[found].description, HIGHEST);
            strcpy(itemTracker->allProductID[allProductIndex].description,
                   user->item[found].description);
            show_product(user);
        }
        else
            printf("Invalid choice.\n");
    }
    if (found == -1)
        printf("INVALID ITEM");
}

/*  Function "show_product" is used to display the list of products of a
    particular seller. It takes in an infoType struct array as a parameter, which
    contains the information of the products of the seller.

    @param user[] - An array of infoType structs representing the seller's products.
*/
void show_product(infoType user[])
{
    int i;

    // lagyan condition para di print pag walawng item user
    printf("\n\n+---------------------------------------------------------------------------+\n");
    printf("|  ProductID  |    Item Name    |    Category    |  Unit Price  |  Quantity |\n");
    for (i = 0; i < user->productCount; i++)
    {
        printf("+---------------------------------------------------------------------------+\n");
        printf("|  %10ld | %-15s | %-15s|     %8.2f | %9d |\n", user->item[i].productID,
               user->item[i].itemName, user->item[i].category, user->item[i].price, user->item[i].quantity);
        printf("+---------------------------------------------------------------------------+\n");
        printf("| Description | %-35s                         |\n", user->item[i].description);
    }
    printf("+---------------------------------------------------------------------------+\n");
}

/*  Function "show_lowProduct" is used to display the list of products of a
    particular seller which stock is low. It shows productID that is below quantity
    of 5 one by one and iterates until the end of productCount of the seller.

    @param user[] - An array of infoType structs representing the seller's products.
*/
void show_lowProductStock(infoType user[])
{
    int i;
    char choice;

    for (i = 0; i < user->productCount && (choice != 'X' || choice == 'x'); i++)
        if (user->item[i].quantity < 5) // show only less than 5 stock.
        {
            printf("\n+---------------------------------------------------------------------------+\n");
            printf("|  ProductID  |    Item Name    |    Category    |  Unit Price  |  Quantity |\n");
            printf("+---------------------------------------------------------------------------+\n");
            printf("|  %10ld | %-15s | %-15s|     %8.2f | %9d |\n", user->item[i].productID,
                   user->item[i].itemName, user->item[i].category, user->item[i].price, user->item[i].quantity);
            printf("+---------------------------------------------------------------------------+\n");
            printf("|%-30s                                             |\n", user->item[i].description);
            printf("+---------------------------------------------------------------------------+\n");
            printf(" Exit [X]                                                           Next [N]\n\n");
            printf("Choice: ");
            scanf(" %c", &choice);
        }
    if (i == user->productCount && (choice == 'N' || choice == 'n'))
        printf("The list of products with low stock has been completed.");
}

/*
    Function "sell_menu"  displays a menu of options for a seller to choose from.
     The function continues to display the menu until the seller chooses to exit.

    @param user[] - An array of infoType structs representing the seller's products.
    @param *itemTracker - A pointer to an itemTrackerType struct that keeps track of
    and update all products in the system.
*/
void sell_menu(infoType user[], itemTrackerType *itemTracker)
{
    int choice = 0;

    while (choice != 5)
    {
        printf("\nSelect services:\n");
        printf("[1] Add New Item\n");
        printf("[2] Edit Stock\n");
        printf("[3] Show My Products\n");
        printf("[4] Show My Low Stock Products\n");
        printf("[5] Exit Sell Menu\n");
        printf("--------------------------------\n");
        printf("Choice: ");
        scanf("%d", &choice);

        if (choice == 1)
            register_productID(user, itemTracker);
        else if (user->productCount == 0)
            printf("You don't have anything in your cart yet.\n");
        else if (choice == 2)
            edit_stock(user, itemTracker);
        else if (choice == 3)
            show_product(user);
        else if (choice == 4)
            show_lowProductStock(user);
    }
}

/*
    Function "view_allProduct" displays all products in the system one by one using
    the show_product function, sorted per seller. The function prompts the user to
    proceed one by one or exit the view all product. If the user chooses to see the
    next product, the function displays the products of the next seller in the sorted
    order. If there are no more products to display, the function displays a message
    indicating that the list is complete.

   @param user[] - An array of infoType structs representing information of the user.
   @param numberOfUser - Used in the loop that determines the last index in the user array.
*/
void view_allProduct(infoType user[], int numberOfUser)
{
    int i;
    char choice = 'N';

    for (i = 0; i < numberOfUser && choice != 'X'; i++)
    {
        if (user[i].productCount > 0)
        {
            printf("\nSeller ID: %ld", user[i].userID);
            show_product(&user[i]);
            printf("Input [N] to see the next product\n");
            printf("Input [X] to exit\n");
            printf("Choice: ");
            scanf(" %c", &choice);
        }
    }
    if (i == numberOfUser && choice != 'X')
        printf("This is the complete list of products.\n");
}

/*
    Function "show_itemCatalog" displays the specialized catalog of items belonging to a
    specific seller identified by index "i" in the "user" array. It prints the seller ID and
    table ofitems with their respective information that is used in function
    "View_specificProductName" and "View__productCategory"

    @param user[] - An array of infoType structs representing information of the user.
    @param i - Index of the seller.
    @param j - Index of the item of seller.
    @param *header - A pointer to an integer that indicates whether the header of the item
    catalog table has already been printed (0 for not printed, 1 for printed).
*/
void show_itemCatalog(infoType user[], int i, int j, int *header)
{
    printf("\nSeller ID: %ld\n", user[i].userID);
    if (*header == 0)
    {
        printf("+---------------------------------------------------------------------------+\n");
        printf("|  ProductID  |    Item Name    |    Category    |  Unit Price  |  Quantity |\n");
        printf("+---------------------------------------------------------------------------+\n");
        *header = 1;
    }
    printf("|  %10ld | %-15s | %-15s|     %8.2f | %9d |\n", user[i].item[j].productID,
           user[i].item[j].itemName, user[i].item[j].category, user[i].item[j].price, user[i].item[j].quantity);
    printf("+---------------------------------------------------------------------------+\n");
    printf("| Description | %-35s                         |\n", user[i].item[j].description);
    printf("+---------------------------------------------------------------------------+\n");
}

/*  Function "view_specificSellerProduct" displays a list of all the sellers and
    asks the user to input the ID of the seller whose products they wish to view.
    It then uses binary search to find the index of the seller in the user array,
    it shows the list of user products using the show_product function. If the seller is found
    but has no products listed, it prints a message saying so. If the seller is not
    found, it prints an error message saying that the input seller ID is invalid.

   @param user[] - An array of infoType structs representing information of the user.
   @param numberOfUser - Used in the loop that determines the last index in the user array.
*/
void view_specificSellerProduct(infoType user[], int numberOfUser)
{
    int i;
    long userID;
    int found;

    printf("\n\nList of sellers:\n");
    for (i = 0; i < numberOfUser; i++)
        if (user[i].productCount > 0) // Print user that sells product
            printf("UserID: %ld\n", user[i].userID);

    printf("Enter sellerID whose products you wish to view: ");
    scanf("%ld", &userID);

    found = binarySearch_user(user, numberOfUser, userID);
    if (found != -1 && user[found].productCount > 0)
        show_product(&user[found]);
    else if (found != -1 && user[found].productCount == 0)
        printf("There are currently no items listed by user %ld.\n", user[found].userID);
    else
        printf("Invalid SellerID.\n");
}

/*
    Function "View__productCategory" allows the user to enter a product category to
    view. Then iterates through each user's product list to find items that match the
    specified category and displays them using the show_itemCatalog function.

   @param user[] - An array of infoType structs representing information of the user.
   @param numberOfUser - Used in the loop that determines the last index in the user array.
*/
void view__productCategory(infoType user[], int numberOfUser)
{
    int i = 0, j;
    char choice = ' ';
    str15 categoryKey;
    int header;
    int flag;
    int found = 0;

    printf("Enter category: ");
    getString(categoryKey, LOW);

    while (i < numberOfUser && (choice != 'X' || choice == 'x'))
    {
        header = 0;
        flag = 0;
        for (j = 0; j < user[i].productCount; j++)
        {
            if (strstr(user[i].item[j].category, categoryKey) != NULL) // check substring
            {
                show_itemCatalog(user, i, j, &header);
                flag = 1;
                found = 1;
            }
        }
        if (flag == 1)
        {
            printf(" Exit [X]                                                           Next [N]\n\n");
            printf("Choice: ");
            scanf(" %c", &choice);
        }
        i++;
    }
    if (i == numberOfUser && (choice == 'N' || choice == 'n'))
        printf("The list of products in category: %s been completed.\n", categoryKey);

    if (found == 0)
        printf("No products found in the specified category.\n");
}

/*
    Function "View_specificProductName" allows the user to enter a product name to
    view. Then iterates through each user's product list to find speicifc item name that
    matches the specified itemName.

   @param user[] - An array of infoType structs representing information of the user.
   @param numberOfUser - Used in the loop that determines the last index in the user array.
*/
void view_specificProductName(infoType user[], int numberOfUser)
{
    int i = 0, j;
    str15 itemKey;
    char *found, choice;
    int flag, header, checker = 0;

    printf("Search item or item keyword: ");
    getString(itemKey, LOW);

    while (i < numberOfUser && (choice != 'X' || choice == 'x'))
    {
        header = 0;
        flag = 0;
        for (j = 0; j < user[i].productCount; j++)
        {
            found = strstr(user[i].item[j].itemName, itemKey);
            if (found != NULL)
            {
                show_itemCatalog(user, i, j, &header);
                flag = 1;
                checker = 1;
            }
        }
        if (flag == 1)
        {
            printf(" Exit [X]                                                           Next [N]\n\n");
            printf("Choice: ");
            scanf(" %c", &choice);
        }
        i++;
    }
    if (i == numberOfUser && (choice == 'N' || choice == 'n'))
        printf("The list of products in specified name: %s been completed.\n", itemKey);

    if (checker == 0)
        printf("No products found in the specified name.\n");
}

/*
    Function "add_toCart" allows the current user to add a product to their shopping cart.
    It prompts the user to enter the product ID and the desired quantity, and then checks
    if the product is available in the allProductID array. If the product is found, it
    checks if the user is trying to buy their own product, if the item is out of stock,
    or if the requested quantity exceeds the available quantity. If the requested product
    is available and meets the conditions, it is added to the user's shopping cart.

    @param user[] - An array of infoType structs representing information of the user.
    @param itemTracker - itemTrackerType struct representing all of the product information in the system.
    @param currentUserIndex - Index of the current user in the user array.
    @param numberOfUser - Used in the loop that determines the last index in the user array.
*/
void add_toCart(infoType user[], itemTrackerType itemTracker, int currentUserIndex, int numberOfUser)
{
    long productID;
    long productOwner;
    int found;
    int productOwnderIndex;
    int i = currentUserIndex, j;
    int itemQuantity;
    int itemAlreadyInCart = 0;

    printf("\n=============CART==============\n");
    if (user[i].cartCount < 10) // limits buyer's cart up to 10 items only.
    {
        printf("Enter productID you wish to buy: ");
        scanf("%ld", &productID);
        printf("Enter quantity you wish to buy: ");
        scanf("%d", &itemQuantity);

        // search productID
        found = binarySearch_allProductID(itemTracker, productID);
        if (found != -1)
        {
            productOwner = itemTracker.allProductID[found].sellerID;
            // search owner of product
            productOwnderIndex = binarySearch_user(user, numberOfUser, productOwner);

            if (currentUserIndex == productOwnderIndex)
                printf("You can't buy your own product\n");
            else if (itemTracker.allProductID[found].quantity <= 0)
                printf("Item %ld is currently out of stock.\n", productID);
            else if (itemTracker.allProductID[found].quantity < itemQuantity)
                printf("Item %ld current stock is only %d.\n", productID,
                       itemTracker.allProductID[found].quantity);
            else
            {
                for (j = 0; j < user[i].cartCount && itemAlreadyInCart == 0; j++)
                {
                    if (user[i].cart[j].productID == productID)
                    {
                        user[i].cart[j].quantity += itemQuantity; // add to quantity to item that is already in cart
                        printf("You`ve sucessfuly added %d quantity to item %ld in your cart.\n",
                               itemQuantity, productID);
                        itemAlreadyInCart = 1;
                    }
                }
                // If item is already in the cart, it only updates the quantity and doesn't overwrite the cart Item.
                if (itemAlreadyInCart == 0)
                {
                    user[i].cart[user[i].cartCount].sellerID = itemTracker.allProductID[found].sellerID;
                    user[i].cart[user[i].cartCount].productID = productID;
                    user[i].cart[user[i].cartCount].price = itemTracker.allProductID[found].price;
                    user[i].cart[user[i].cartCount].quantity = itemQuantity;
                    strcpy(user[i].cart[user[i].cartCount].itemName,
                           itemTracker.allProductID[found].itemName);
                    strcpy(user[i].cart[user[i].cartCount].category,
                           itemTracker.allProductID[found].category);
                    strcpy(user[i].cart[user[i].cartCount].description,
                           itemTracker.allProductID[found].description);
                    user[i].cartCount++;
                    printf("You've successfully added item %ld in your cart.\n", productID);
                }
            }
        }
        else
            printf("Invalid productID.\n");
    }
    else
    {
        printf("The system has a limit of 10 items that can be added to the cart at any given time.\n");
        printf("To add more items to the cart, user must either proceed to the checkout or edit the current cart.\n");
    }
}

/*
    Function "show_cart" displays all the items in the user's cart grouped by the seller ID.
    It first retrieves the UserID of each cart item and groups the items based on the seller.
    For each seller, it displays a table of all their items in the cart, including the ProductID, Item Name, Category, Unit Price, Quantity, and Description.

    @param user - An array of infoType struct representing all the user information in the system.
    @param currentUserIndex - An integer representing the index of the current user.
*/
void show_cart(infoType user[], int currentUserIndex)
{
    int i = currentUserIndex, j, k, l;
    long userID[10];
    int found[10] = {0};

    if (user[i].cartCount == 0)
        printf("You don't have anything in the cart.");
    else
    {

        // assign carts UserID to new local UserID
        for (j = 0; j < user[i].cartCount; j++)
            userID[j] = user[i].cart[j].sellerID;

        for (k = 0; k < user[i].cartCount; k++)
        {
            if (found[k] == 0) // if item hasn't been printed yet
            {
                printf("\nSeller ID: %ld", userID[k]);
                printf("\n\n+---------------------------------------------------------------------------+\n");
                printf("|  ProductID  |    Item Name    |    Category    |  Unit Price  |  Quantity |\n");
                for (l = 0; l < user[i].cartCount; l++)
                {
                    if (userID[k] == user[i].cart[l].sellerID && found[l] == 0)
                    {
                        printf("+---------------------------------------------------------------------------+\n");
                        printf("|  %10ld | %-15s | %-15s|     %8.2f | %9d |\n", user[i].cart[l].productID,
                               user[i].cart[l].itemName, user[i].cart[l].category,
                               user[i].cart[l].price, user[i].cart[l].quantity);
                        printf("+---------------------------------------------------------------------------+\n");
                        printf("| Description | %-35s                         |\n",
                               user[i].cart[l].description);
                        found[l] = 1; // mark item as printed to avoid repetition.
                    }
                }
                printf("+---------------------------------------------------------------------------+\n");
            }
        }
    }
}

/*
    Function "remove_sellerItem" ask users for a specific seller which users wants
    to removes from the user's cart.

    @param user[] - An array of infoType structs representing information of the user
    @param currentUserIndex - Index of the current user in the user array.
*/
void remove_sellerItem(infoType user[], int currentUserIndex)
{
    int i, j;
    long removeUser;
    int removeCount = 0;
    printf("\nEnter userID you want to remove in the cart: ");
    scanf("%ld", &removeUser);

    for (i = 0; i < user[currentUserIndex].cartCount; i++)
    {
        if (user[currentUserIndex].cart[i].sellerID == removeUser)
        {
            // shift remaining Items to the left after removal.
            for (j = i; j < user[currentUserIndex].cartCount - 1; j++)
                user[currentUserIndex].cart[j] = user[currentUserIndex].cart[j + 1];

            user[currentUserIndex].cartCount--;
            removeCount++;
            i--;
        }
    }

    if (removeCount == 0)
        printf("User %ld item`s is not in your cart.\n", removeUser);
    else
    {
        printf("\n================================Updated Cart================================\n");
        show_cart(user, currentUserIndex);
        printf("(%d) item/s were removed from seller %ld from your cart.\n",
               removeCount, removeUser);
    }
}
/*
    Function "remove_specificItem" ask users for specific item users wants to
    removes from the user's cart.

    @param user[] - An array of infoType structs representing information of the user
    @param currentUserIndex - Index of the current user in the user array.
*/
void remove_specificItem(infoType user[], int currentUserIndex)
{
    long removeProduct;
    int i, j;
    int found = 0;
    printf("Enter productID you wish to remove: ");
    scanf("%ld", &removeProduct);

    for (i = 0; i < user[currentUserIndex].cartCount && found == 0; i++)
    {
        if (user[currentUserIndex].cart[i].productID == removeProduct)
        {
            // shift remaining Items to the left after removal.
            for (j = i; j < user[currentUserIndex].cartCount - 1; j++)
                user[currentUserIndex].cart[j] = user[currentUserIndex].cart[j + 1];

            user[currentUserIndex].cartCount--;
            found = 1;
        }
    }

    if (found == 0)
        printf("ProductID: %ld is not in your cart.\n", removeProduct);
    else
    {
        printf("\n================================Updated Cart================================\n");
        show_cart(user, currentUserIndex);
        printf("ProductID: %ld were removed from your cart\n", removeProduct);
    }
}

/*
    Function "edit_cartQuantity" ask users for new quantity of specific item
    and update it from the user's cart.

    @param user[] - An array of infoType structs representing information of the user
    @param currentUserIndex - Index of the current user in the user array.
*/
void edit_cartQuantity(infoType user[], itemTrackerType itemTracker, int currentUserIndex)
{
    int i;
    long productID;
    int newQuantity;
    int flag = 0;
    int found;

    printf("Enter productID you wish to edit its quantity: ");
    scanf("%ld", &productID);

    for (i = 0; i < user[currentUserIndex].cartCount && flag == 0; i++)
    {
        if (user[currentUserIndex].cart[i].productID == productID)
        {
            printf("Enter new quantity: ");
            scanf("%d", &newQuantity);

            found = binarySearch_allProductID(itemTracker, productID);
            if (itemTracker.allProductID[found].quantity < newQuantity)
                flag = 2;
            else
            {
                user[currentUserIndex].cart[i].quantity = newQuantity;
                flag = 1;
            }
        }
    }
    if (flag == 0)
        printf("ProductID: %ld is not in your cart.\n", productID);
    else if (flag == 2)
        printf("ProductID: %ld current stock is only %d.\n",
               productID, itemTracker.allProductID[found].quantity);
    else
    {
        printf("\n================================Updated Cart================================\n");
        show_cart(user, currentUserIndex);
        printf("ProductID: %ld quantity has been updated to %d\n", productID, newQuantity);
    }
}
/*
    Function "edit_cart" function allows the user to modify the items in their cart by
    choosing from a list of services:

    @param user[] - An array of infoType structs representing information of the user
    @param itemTracker - itemTrackerType struct representing all of the product information in the system..
    @param currentUserIndex - Index of the current user in the user array.
*/
void edit_cart(infoType user[], itemTrackerType itemTracker, int currentUserIndex)
{
    int choice = 0;

    show_cart(user, currentUserIndex);
    printf("\nSelect services:\n");
    printf("[1] Remove all items from specific seller\n");
    printf("[2] Remove Specific Item\n");
    printf("[3] Edit Quantity\n");
    printf("[4] Finish Edit Cart\n");
    printf("--------------------------------------------\n");
    printf("Choice: ");
    scanf("%d", &choice);

    if (choice == 1)
        remove_sellerItem(user, currentUserIndex);
    else if (choice == 2)
        remove_specificItem(user, currentUserIndex);
    else if (choice == 3)
        edit_cartQuantity(user, itemTracker, currentUserIndex);
}

/*
    Function "validate_checkOut" checks the items in the user's cart before checking out,
    it checks if the user cart price/quantity is outdated and updates the cart if it is.
    if necessary based on changes in price or stock availability.

    @param user[] - An array of infoType structs representing information of the user
    @param itemTracker - itemTrackerType struct representing all of the product information in the system..
    @param currentUserIndex - Index of the current user in the user array.
*/
void validate_checkOut(infoType user[], itemTrackerType itemTracker, int currentUserIndex)
{
    int i;
    int found;

    for (i = 0; i < user[currentUserIndex].cartCount; i++)
    {
        found = binarySearch_allProductID(itemTracker, user[currentUserIndex].cart[i].productID);
        // Checks if price is not equal to sellers product.
        if (user[currentUserIndex].cart[i].price != itemTracker.allProductID[found].price)
        {
            printf("Item %ld price has been updated!\n",
                   itemTracker.allProductID[found].productID);
            printf("Old Price: %.2f\nNew Price: %.2f\n",
                   user[currentUserIndex].cart[i].price, itemTracker.allProductID[found].price);
            user[currentUserIndex].cart[i].price = itemTracker.allProductID[found].price;
            printf("You can still edit your cart before checking out.\n");
            printf("\n================================Updated Cart================================\n");
            show_cart(user, currentUserIndex);
        }
        // Checks if quantity is not equal to sellers product.
        if (user[currentUserIndex].cart[i].quantity > itemTracker.allProductID[found].quantity)
        {
            printf("Item %ld stock has been updated!\n", itemTracker.allProductID[found].productID);
            printf("Your quantity: %d\nAvailability: %d\n", user[currentUserIndex].cart[i].quantity,
                   itemTracker.allProductID[found].quantity);
            user[currentUserIndex].cart[i].quantity = itemTracker.allProductID[found].quantity;
            printf("Your cart quantity for %ld is reduced to maximum stock available (%d).\n",
                   itemTracker.allProductID[found].productID, itemTracker.allProductID[found].quantity);
            printf("You can still edit your cart before checking out.\n");
            printf("\n================================Updated Cart================================\n");
            show_cart(user, currentUserIndex);
        }
    }
}

/*
    Function "checkOut_allItem" processes the checkout all of the products in the
    current user's cart. It updates the seller's stock, the allProductID list,
    writes the transaction to a binary file, and updates the current user's cart.

    @param user[] - An array of infoType structs representing information of the user
    @param *itemTracker - ItemTrackerType struct representing all of the product information in the system
    and passing it in the buy_menu.
    @param *transaction - A pointer of type transactionType that stores transaction information
    and passing it in the buy_menu.
    @param currentUserIndex - Index of the current user in the user array.
    @param numberOfUser - Used in the loop that determines the last index in the user array.
*/
void checkOut_allItem(infoType user[], itemTrackerType *itemTracker, transactionType *transaction,
                      int currentUserIndex, int numberOfUser)
{
    int i, j, k, l;
    float totalCartPrice, totalPayableSeller, totalPrice, totalBuyerCart = 0;
    int flag, found, token;

    transaction->buyerID = user[currentUserIndex].userID;

    for (i = 0; i < user[currentUserIndex].cartCount; i++)
    {
        flag = 0;
        totalCartPrice = 0;
        totalPayableSeller = 0;

        /* if the current seller ID is equal to next seller ID in the cart it notifies
        there more than 1 product of Seller ID is in the cart and won't print if more than
        1 product, it will print at the last when theres no more duplicate*/
        for (k = i + 1; k < user[currentUserIndex].cartCount && flag == 0; k++)
            if (user[currentUserIndex].cart[i].sellerID == user[currentUserIndex].cart[k].sellerID)
                flag = 1;
        if (flag == 0)
        {
            printf("\nSeller ID: %ld\n", user[currentUserIndex].cart[i].sellerID);
            printf("+-----------------------------------------------------------------------------+\n");
            printf("|  ProductID  |    Item Name    |  Quantity  |  Unit Price  |   Total Price   |\n");
            printf("+-----------------------------------------------------------------------------+\n");
        }
        l = 0;
        for (j = 0; j < user[currentUserIndex].cartCount && flag == 0; j++)
        {
            if (user[currentUserIndex].cart[i].sellerID == user[currentUserIndex].cart[j].sellerID)
            {
                totalPrice = user[currentUserIndex].cart[j].quantity * user[currentUserIndex].cart[j].price;
                printf("|  %10ld | %-15s |  %9d |     %8.2f |        %8.2f |\n",
                       user[currentUserIndex].cart[j].productID, user[currentUserIndex].cart[j].itemName,
                       user[currentUserIndex].cart[j].quantity, user[currentUserIndex].cart[j].price, totalPrice);
                totalCartPrice += totalPrice;
                printf("+-----------------------------------------------------------------------------+\n");

                // Updates allProductID quantity
                found = binarySearch_allProductID(*itemTracker, user[currentUserIndex].cart[j].productID);
                itemTracker->allProductID[found].quantity -= user[currentUserIndex].cart[j].quantity;

                // Updates sellers quantity
                found = binarySearch_user(user, numberOfUser, user[currentUserIndex].cart[j].sellerID);
                token = binarySearch_productID(&user[found], user[currentUserIndex].cart[j].productID);
                user[found].item[token].quantity -= user[currentUserIndex].cart[j].quantity;
                transaction->sellerID = user[currentUserIndex].cart[j].sellerID;
                // writebinary transaction
                transaction->item[l] = user[currentUserIndex].cart[j];
                transaction->totalPrice += totalPrice;
                l++;
            }
            if (l == 5 || (j == user[currentUserIndex].cartCount - 1 && transaction->totalPrice != 0))
            {
                writeBinaryFIle_transaction(*transaction);
                transaction->totalPrice = 0;
                l = 0;
            }
        }

        if (flag == 0)
        {
            totalPayableSeller += totalCartPrice;
            printf("| Total Payable to sellerID %-8ld                           %14.2f |\n",
                   user[currentUserIndex].cart[i].sellerID, totalPayableSeller);
            printf("+-----------------------------------------------------------------------------+\n\n");
        }
        // buyers Total
        totalBuyerCart += totalPayableSeller;
    }

    printf("Transaction date %d/%d/%d\n", transaction->date.month,
           transaction->date.day, transaction->date.year);
    printf("Total amount in your cart is: %.2f\n", totalBuyerCart);

    // Remove cart of user
    for (i = 0; i < user[currentUserIndex].cartCount; i++)
        user[currentUserIndex].cart[i] = user[currentUserIndex].cart[10];

    user[currentUserIndex].cartCount = 0;
}

/*
    Function "checkOut_specificSeller" processes the checkout of a specific seller's products
    from the current user's cart. It updates the seller's stock, the allProductID list,
    writes the transaction to a binary file, and updates the current user's cart.

    @param user[] - an array of structs of type infoType that stores information about the users and their products.
    @param *itemTracker - ItemTrackerType struct representing all of the product information in the system
    and passing it in the buy_menu.
    @param *transaction - A pointer of type transactionType that stores transaction information
    and passing it in the buy_menu.
    @param currentUserIndex - Index of the current user in the user array.
    @param numberOfUser - Used in the loop that determines the last index in the user array.
*/
void checkOut_specificSeller(infoType user[], itemTrackerType *itemTracker, transactionType *transaction,
                             int currentUserIndex, int numberOfUser)
{
    int i = 0, j, k = 0;
    int productIDflag = 0;
    int flag = 0, found = 0, token = 0;
    int productIndex;
    int header = 0;
    long sellerID;
    float totalCartPrice = 0, totalPrice = 0;

    printf("Enter the seller ID of the items you want to purchase from your cart: ");
    scanf("%ld", &sellerID);

    found = binarySearch_user(user, numberOfUser, sellerID);
    while (i < user[currentUserIndex].cartCount)
    {
        flag = 0;
        if (user[currentUserIndex].cart[i].sellerID == sellerID)
        {
            flag = 1;
            productIDflag = 1;

            // Update Seller stock
            for (j = 0; j < user[found].productCount && token != 1; j++)
                if (user[found].item[j].productID == user[currentUserIndex].cart[i].productID)
                {
                    token = 1;
                    user[found].item[j].quantity -= user[currentUserIndex].cart[i].quantity;
                    // test this pa
                }
            // Update all productIndex
            productIndex = binarySearch_allProductID(*itemTracker, user[currentUserIndex].cart[i].productID);
            itemTracker->allProductID[productIndex].quantity -= user[currentUserIndex].cart[i].quantity;
            token = 0;
        }

        if (flag == 1 && header == 0)
        {
            printf("\nSeller ID: %ld\n", user[currentUserIndex].cart[i].sellerID);
            printf("+-----------------------------------------------------------------------------+\n");
            printf("|  ProductID  |    Item Name    |  Quantity  |  Unit Price  |   Total Price   |\n");
            printf("+-----------------------------------------------------------------------------+\n");
            header = 1;
        }
        if (flag == 1)
        {
            totalPrice = user[currentUserIndex].cart[i].quantity * user[currentUserIndex].cart[i].price;
            printf("|  %10ld | %-15s |  %9d |     %8.2f |        %8.2f |\n",
                   user[currentUserIndex].cart[i].productID, user[currentUserIndex].cart[i].itemName,
                   user[currentUserIndex].cart[i].quantity, user[currentUserIndex].cart[i].price, totalPrice);
            totalCartPrice += totalPrice;
            printf("+-----------------------------------------------------------------------------+\n");

            // writebinary transaction
            transaction->item[k] = user[currentUserIndex].cart[i];
            transaction->totalPrice += totalPrice;
            k++;
            // write file when cartcount is done or its more than 5 item per user
            if (k == 5 || i == user[currentUserIndex].cartCount - 1)
            {
                writeBinaryFIle_transaction(*transaction);
                transaction->totalPrice = 0;
                k = 0; // resets count
            }

            // Updates currentUser cart
            for (j = i; j < user[currentUserIndex].cartCount - 1; j++)
                user[currentUserIndex].cart[j] = user[currentUserIndex].cart[j + 1];

            user[currentUserIndex].cartCount--;
            i--;
        }
        i++;
    }

    if (productIDflag == 0)
        printf("SellerID %ld product's is not in your cart.\n", sellerID);
    else
    {
        printf("| Total Payable to sellerID %ld:                                %14.2f |\n",
               sellerID, totalCartPrice);
        printf("+-----------------------------------------------------------------------------+\n\n");
        printf("Transaction date %d/%d/%d\n", transaction->date.month,
               transaction->date.day, transaction->date.year);
        // assign buyer and seller ID in transaction
        transaction->buyerID = user[currentUserIndex].userID;
        transaction->sellerID = user[currentUserIndex].cart[i].sellerID;
    }
}

/*
    The "checkOut_specificItem" function allows a user to purchase a specific item
    from their cart, updating the necessary data structures and generating a
    transaction record.

    @param user[] - an array of structs of type infoType that stores information about the users and their products.
    @param *itemTracker - ItemTrackerType struct representing all of the product information in the system
    and passing it in the buy_menu.
    @param *transaction - A pointer of type transactionType that stores transaction information
    and passing it in the buy_menu.
    @param currentUserIndex - Index of the current user in the user array.
    @param numberOfUser - Used in the loop that determines the last index in the user array.

*/
void checkOut_specificItem(infoType user[], itemTrackerType *itemTracker, transactionType *transaction, int currentUserIndex, int numberOfUser)
{
    int i, j;
    int found = 0;
    int flag = 0;
    long productID;
    float totalPrice = 0;

    printf("Enter productID of the item you want to purchase from your cart: ");
    scanf("%ld", &productID);

    // search productID in the cart
    for (i = 0; i < user[currentUserIndex].cartCount && found == 0; i++)
        if (user[currentUserIndex].cart[i].productID == productID)
            found = 1;

    if (found == 1)
    {
        i--; // set to correct position
        printf("\nSeller ID: %ld\n", user[currentUserIndex].cart[i].sellerID);
        printf("+-----------------------------------------------------------------------------+\n");
        printf("|  ProductID  |    Item Name    |  Quantity  |  Unit Price  |   Total Price   |\n");
        printf("+-----------------------------------------------------------------------------+\n");
        totalPrice = user[currentUserIndex].cart[i].quantity * user[currentUserIndex].cart[i].price;
        printf("|  %10ld | %-15s |  %9d |     %8.2f |        %8.2f |\n",
               user[currentUserIndex].cart[i].productID, user[currentUserIndex].cart[i].itemName,
               user[currentUserIndex].cart[i].quantity, user[currentUserIndex].cart[i].price, totalPrice);
        printf("+-----------------------------------------------------------------------------+\n");
        printf("| Total Payable to sellerID %ld:                                %15.2f |\n",
               user[currentUserIndex].cart[i].sellerID, totalPrice);
        printf("+-----------------------------------------------------------------------------+\n");
        printf("Transaction date %d/%d/%d\n", transaction->date.month, transaction->date.day,
               transaction->date.year);

        // writebinary transaction
        transaction->item[0] = user[currentUserIndex].cart[i];
        transaction->totalPrice = totalPrice;
        transaction->buyerID = user[currentUserIndex].userID;
        transaction->sellerID = user[currentUserIndex].cart[i].sellerID;
        writeBinaryFIle_transaction(*transaction);

        // Update allProductID stock
        found = binarySearch_allProductID(*itemTracker, productID);
        itemTracker->allProductID[found].quantity -= user[currentUserIndex].cart[i].quantity;

        // Update seller stock
        found = binarySearch_user(user, numberOfUser, itemTracker->allProductID[found].sellerID);
        for (j = 0; j < user[found].productCount && flag == 0; j++)
            if (user[found].item[j].productID == productID)
            {
                flag = 1;
                user[found].item[j].quantity -= user[currentUserIndex].cart[i].quantity;
            }

        // remove specific Items from the cart
        for (j = i; j < user[currentUserIndex].cartCount; j++)
            user[currentUserIndex].cart[j] = user[currentUserIndex].cart[j + 1];

        user[currentUserIndex].cart[j + 1] = user[currentUserIndex].cart[10];
        user[currentUserIndex].cartCount--;
    }
    else
        printf("ProductID %ld is not in your cart.\n", productID);
}

/*
    The checkOut_menu function displays a menu for checking out the products in the
    user's cart and performs different operations based on the user's choice.
    It allows the user to enter the date of purchase, validate the cart for check-out,
    and choose to check out all items, items from a specific seller, or a specific item.

    @param user[] - an array of structs of type infoType that stores information about the users and their products.
    @param *itemTracker - ItemTrackerType struct representing all of the product information in the system
    and passing it in the buy_menu.
    @param *transaction - A pointer of type transactionType that stores transaction information
    and passing it in the buy_menu.
    @param currentUserIndex - Index of the current user in the user array.
    @param numberOfUser - Used in the loop that determines the last index in the user array.
*/
void checkOut_menu(infoType user[], itemTrackerType *itemTracker, transactionType *transaction,
                   int currentUserIndex, int numberOfUser, int read)
{
    int choice = 0;

    printf("Enter the date of purchase (MM/DD/YYYY): \n");
    printf("Month: ");
    scanf("%d", &transaction->date.month);
    printf("Day: ");
    scanf("%d", &transaction->date.day);
    printf("Year: ");
    scanf("%d", &transaction->date.year);

    validate_checkOut(user, *itemTracker, currentUserIndex);

    printf("\nSelect Check Out services:\n");
    printf("[1] All Items\n");
    printf("[2] By a Specific Seller\n");
    printf("[3] Specific Item\n");
    printf("[4] Exit Check Out\n");
    printf("--------------------------------\n");
    printf("Choice: ");
    scanf("%d", &choice);

    // if cart file is present, it will overwrite the old file to empty for checkoutALLitem
    if (choice == 1 && read == 1)
    {
        checkOut_allItem(user, itemTracker, transaction, currentUserIndex, numberOfUser);
        writeTextFile_cart(user, currentUserIndex);
    }
    else if (choice == 1)
        checkOut_allItem(user, itemTracker, transaction, currentUserIndex, numberOfUser);
    else if (choice == 2)
        checkOut_specificSeller(user, itemTracker, transaction, currentUserIndex, numberOfUser);
    else if (choice == 3)
        checkOut_specificItem(user, itemTracker, transaction, currentUserIndex, numberOfUser);
}

/*
    The "buy_menu" function displays a menu for buying products and performs different
    operations based on the user's choice.

    @param user - An array of infoType struct representing all the user information in the system.
    @param *itemTracker - ItemTrackerType struct representing all of the product information in the system
    and passing it in the user_menu.
    @param *transaction - A pointer of type transactionType that stores transaction information in the system
    and passing it in the user_menu.
    @param currentUserIndex - Index of the current user in the user array.
    @param numberOfUser - Used in the loop that determines the last index in the user array.
*/
void buy_menu(infoType user[], itemTrackerType *itemTracker, transactionType *transaction,
              int currentUserIndex, int numberOfUser)
{
    int choice = 0;
    int read = 0;

    sort_userProductID(user);
    if (readTextFile_cart(user, currentUserIndex))
        read = 1;
    while (choice != 8)
    {
        printf("\nSelect services:\n");
        printf("[1] View all Products\n");
        printf("[2] Show all Products by a Specific Seller\n");
        printf("[3] Search Products by Category\n");
        printf("[4] Search Products by Name\n");
        printf("[5] Add to Cart\n");
        printf("[6] Edit Cart\n");
        printf("[7] Check Out Menu\n");
        printf("[8] Exit Buy Menu\n");
        printf("------------------------------------------------\n");
        printf("Choice: ");
        scanf("%d", &choice);

        if (choice == 1)
            view_allProduct(user, numberOfUser);
        else if (choice == 2)
            view_specificSellerProduct(user, numberOfUser);
        else if (choice == 3)
            view__productCategory(user, numberOfUser);
        else if (choice == 4)
            view_specificProductName(user, numberOfUser);
        else if (choice == 5)
            add_toCart(user, *itemTracker, currentUserIndex, numberOfUser);
        else if (choice == 6 && user[currentUserIndex].cartCount == 0)
            printf("You don't have anything in the cart.\n");
        else if (choice == 6 && user[currentUserIndex].cartCount > 0)
            edit_cart(user, *itemTracker, currentUserIndex);
        else if (choice == 7 && user[currentUserIndex].cartCount > 0)
            checkOut_menu(user, itemTracker, transaction, currentUserIndex, numberOfUser, read);
        else if (choice == 7 && user[currentUserIndex].cartCount <= 0)
            printf("You don't have anything to check Out\n");
    }
}

/*
    Function "user_menu" displays the login page and uses binary search to validate if
    the userID and password are registered in the system. If found, it displays the
    user menu where the user can select between sell menu, buy menu, and exit menu.
    The function calls sell_menu and buy_menu and writeTextFileCart based on the user's choice.

    @param user[] - Struct arrays of user that stores their information.
    @param numberOfUser - Used in the loop that determines the last index in the user array.

    @param user[] - Struct arrays of user that stores their information.
    param *itemTracker - ItemTrackerType struct representing all of the product information in the system
    and passing it in the main.
    @param *transaction - A pointer of type transactionType that stores transaction information in the system
    and passing it in the main.
    @param numberOfUser - Used in the loop that determines the last index in the user array.
*/
void user_menu(infoType user[], itemTrackerType *itemTracker,
               transactionType *transaction, int numberOfUser)
{
    long userID;
    str10 password;
    int start = 0, middle, end = numberOfUser - 1;
    int found = 0;
    int choice = 0;

    printf("--------LOGIN PAGE--------\n");
    printf("UserID: ");
    scanf("%ld", &userID);
    printf("Password: ");
    scanf("%s", password);

    sort_userID(user, numberOfUser);
    // Continues the loop until start overlaps end variable.
    while (start <= end && found == 0)
    {
        middle = (start + end) / 2;

        if (userID == user[middle].userID && strcmp(password, user[middle].password) == 0)
            found = 1;
        else if (userID > user[middle].userID)
            start = middle + 1;
        else
            end = middle - 1;
    }
    // If found, ask user for another input and recheck it again.
    if (found == 1)
    {
        printf("\n\nLOGIN SUCCESS!");
        while (choice != 3)
        {
            printf("\nSelect services:\n");
            printf("[1] Sell Menu\n");
            printf("[2] Buy Menu\n");
            printf("[3] Exit Menu\n");
            printf("--------------------------\n");
            printf("Choice: ");
            scanf("%d", &choice);
            if (choice == 1)
                sell_menu(&user[middle], itemTracker);
            else if (choice == 2)
                buy_menu(user, itemTracker, transaction, middle, numberOfUser);
            else if (choice == 3 && user[middle].cartCount > 0)
                writeTextFile_cart(user, middle);
        }
    }
    else
        printf("UserID or password is INCORRECT, or you may not be registered in the system.\n");
}

/*
    Function "readTextFile_cart" reads the user's cart items from a text file with the filename
    userID.bag and stores them in the user's cart array.

    @param user - An array of infoType struct representing all the user information in the system
    @param currentUserIndex - Index of the current user in the user array.
    @return read - return 1 if file is present and reading is sucessful, return 0
    if there is no userID.bag file.
*/
int readTextFile_cart(infoType user[], int currentUserIndex)
{
    FILE *cartFile;
    str20 fileName;
    long productIDTemp;
    int read = 0;

    sprintf(fileName, "%ld.bag", user[currentUserIndex].userID);
    cartFile = fopen(fileName, "r");

    if (cartFile != NULL)
    {
        while (fscanf(cartFile, "%ld", &productIDTemp) == 1)
        {
            int i = user[currentUserIndex].cartCount;
            user[currentUserIndex].cartCount++;
            user[currentUserIndex].cart[i].productID = productIDTemp;
            fscanf(cartFile, " %ld", &user[currentUserIndex].cart[i].sellerID);
            fscanf(cartFile, " %[^\n]", user[currentUserIndex].cart[i].itemName);
            fscanf(cartFile, " %[^\n]", user[currentUserIndex].cart[i].category);
            fscanf(cartFile, " %[^\n]", user[currentUserIndex].cart[i].description);
            fscanf(cartFile, "%f %d", &user[currentUserIndex].cart[i].price,
                   &user[currentUserIndex].cart[i].quantity);
        }
        read = 1; // file is present and read.
    }
    fclose(cartFile);

    return read;
}

/*
    Function "writeTextFile_cart" writes the user's cart items left from  user cart
    will be written as a text file with the filename userID.bag.

    @param user - An array of infoType struct representing all the user information in the system
    @param currentUserIndex - Index of the current user in the user array.
*/
void writeTextFile_cart(infoType user[], int currentUserIndex)
{
    FILE *cartFile;
    str20 fileName;
    int i;

    sprintf(fileName, "%ld.bag", user[currentUserIndex].userID);
    cartFile = fopen(fileName, "w");

    for (i = 0; i < user[currentUserIndex].cartCount; i++)
    {
        fprintf(cartFile, "%ld %ld\n", user[currentUserIndex].cart[i].productID,
                user[currentUserIndex].cart[i].sellerID);
        fprintf(cartFile, "%s\n", user[currentUserIndex].cart[i].itemName);
        fprintf(cartFile, "%s\n", user[currentUserIndex].cart[i].category);
        fprintf(cartFile, "%s\n", user[currentUserIndex].cart[i].description);
        fprintf(cartFile, "%.2f %d\n\n", user[currentUserIndex].cart[i].price,
                user[currentUserIndex].cart[i].quantity);
    }

    fclose(cartFile);
}
/*
    Function "show_allUser" displays all registered users in the system.

    @param user - An array of infoType struct representing all the user information in the system.
    @param numberOfUser - Used in the loop that determines the last index in the user array.
*/
void show_allUser(infoType user[], int numberOfUser)
{
    int i;

    printf("\n\nRegistered User in the System\n");
    printf("+----------------------------------------------------------------------------------------------------------+\n");
    printf("|      UserID    |   Password  |           Name          |              Address             | Phone Number |\n");
    for (i = 0; i < numberOfUser; i++)
    {
        printf("+----------------------------------------------------------------------------------------------------------+\n");
        printf("|   %12ld |  %-10s |  %-20s   |  %-30s  | %12ld |\n", user[i].userID, user[i].password, user[i].name, user[i].address, user[i].contact);
    }
    printf("+----------------------------------------------------------------------------------------------------------+\n");
}

/*
    Function "show_allSeller" displays all registered sellers in the system with
    their respective information.

    @param user - An array of infoType struct representing all the user information in the system.
    @param numberOfUser - Used in the loop that determines the last index in the user array
*/
void show_allSeller(infoType user[], int numberOfUser)
{
    int i;

    printf("\n\nRegistered Seller in the System\n");
    printf("+-----------------------------------------------------------------------------------------------------------------------+\n");
    printf("|     SellerID   |   Password  |           Name          |              Address             | Phone Number | Item Count |\n");
    for (i = 0; i < numberOfUser; i++)
    {
        if (user[i].productCount > 0)
        {
            printf("+-----------------------------------------------------------------------------------------------------------------------+\n");
            printf("|   %12ld |  %-10s |  %-20s   |  %-30s  | %12ld | %10d |\n",
                   user[i].userID, user[i].password, user[i].name, user[i].address, user[i].contact, user[i].productCount);
        }
    }
    printf("+-----------------------------------------------------------------------------------------------------------------------+\n");
}

/*
    Function "get_dateRange" takes two pointers to dateType variables  as parameters.
    It prompts the user to enter a start date and an end date and assigns the
    entered values to dateType struct of the startDate and  endDate variables.

    @param *startDate - dateType struct that passes its startDate month, day, year.
    @param *endDate - dateType struct that passes its eendDate month, day, year.
*/
void get_dateRange(dateType *startDate, dateType *endDate)
{
    printf("Enter start date\n");
    printf("Start Month: ");
    scanf("%d", &startDate->month);
    printf("Start Day: ");
    scanf("%d", &startDate->day);
    printf("Start Year: ");
    scanf("%d", &startDate->year);
    printf("Enter end date\n");
    printf("End Month: ");
    scanf("%d", &endDate->month);
    printf("End Day: ");
    scanf("%d", &endDate->day);
    printf("End Year: ");
    scanf("%d", &endDate->year);
}

/*
    Function "total_salesDuration" asks the user to enter a start date and an end date,
    and reads transaction records from a binary file named "Transactions.dat".
    The function calculates the total sales during the specified duration by comparing
    each transaction's date with the entered start and end dates. If the transaction
    falls within the specified duration, its total price is added to the total sales.

    @param transaction - transactionType struct information of the transactions
    @param return - The function returns the total sales as a double value.

*/
double total_salesDuration(transactionType transaction)
{
    FILE *transactionFile;
    dateType startDate, endDate;
    double totalSales = 0;

    get_dateRange(&startDate, &endDate);

    transactionFile = fopen("Transactions.dat", "rb");
    if (transactionFile == NULL)
        printf("Failed to open file\n");
    else
        while (fread(&transaction, sizeof(transactionType), 1, transactionFile) == 1)
        {

            if (startDate.year == transaction.date.year)
            {
                if (startDate.month == transaction.date.month && startDate.day <= transaction.date.day)
                    totalSales += transaction.totalPrice;
                else if (startDate.month < transaction.date.month)
                    totalSales += transaction.totalPrice;
            }
            else if (endDate.year == transaction.date.year)
            {
                if (endDate.month == transaction.date.month && endDate.day >= transaction.date.day)
                    totalSales += transaction.totalPrice;
                else if (endDate.month > transaction.date.month)
                    totalSales += transaction.totalPrice;
            }
            else if (startDate.year < transaction.date.year && endDate.year > transaction.date.year)
                totalSales += transaction.totalPrice;
        }

    fclose(transactionFile);
    return totalSales;
}

/*
    Function "show_sellerSales" ask the user to enter a start date and an end date,
    and reads transaction records from a binary file named "Transactions.dat". The function then calculates
    the total sales made by each seller within the specified date range by comparing each transaction's date
    with the entered start and end dates. If the transaction falls within the specified duration and is made
    by the current seller being processed, its total price is added to the total sales of the seller. If the
    total sales of a seller is greater than zero, the function prints the seller's ID, name, and total earnings
    in a formatted table. If no transactions are found within the specified duration, the function prints
    a message indicating that no specific transactions were found.

    @param user - An array of infoType struct representing all the user information in the system.
    @param transaction - transactionType struct information of the transactions
    @param numberOfUser -  Used in the loop that determines the last index in the user array.
*/
void show_sellerSales(infoType user[], transactionType transaction, int numberOfUser)
{
    FILE *transactionFile;
    dateType startDate, endDate;
    double total;
    transactionType transactionTemp[MAX];
    int count = 0;
    int i, j;
    int flag = 0;
    get_dateRange(&startDate, &endDate);

    transactionFile = fopen("Transactions.dat", "rb");
    if (transactionFile == NULL)
        printf("Failed to open file\n");
    else
        while (fread(&transactionTemp[count], sizeof(transactionType), 1, transactionFile) == 1)
            count++;
    fclose(transactionFile);

    for (i = 0; i < numberOfUser; i++)
    {
        total = 0;
        for (j = 0; j < count; j++)
        {
            if (startDate.year == transactionTemp[j].date.year &&
                user[i].userID == transactionTemp[j].sellerID)
            {
                if (startDate.month == transactionTemp[j].date.month &&
                    startDate.day <= transactionTemp[j].date.day)
                    total += transactionTemp[j].totalPrice;
                else if (startDate.month < transactionTemp[j].date.month)
                    total += transactionTemp[j].totalPrice;
            }
            else if (endDate.year == transactionTemp[j].date.year &&
                     user[i].userID == transactionTemp[j].sellerID)
            {
                if (endDate.month == transactionTemp[j].date.month &&
                    endDate.day >= transactionTemp[j].date.day)
                    total += transactionTemp[j].totalPrice;
                else if (endDate.month > transactionTemp[j].date.month)
                    total += transactionTemp[j].totalPrice;
            }
            else if (startDate.year < transactionTemp[j].date.year &&
                     endDate.year > transactionTemp[j].date.year && user[i].userID == transactionTemp[j].sellerID)
                total += transactionTemp[j].totalPrice;
        }
        if (total > 0)
        {
            flag = 1;
            printf("+-------------------------------------------------------------+\n");
            printf("|    SellerID   |      Seller Name      |    Total Earnings   |\n");
            printf("+-------------------------------------------------------------+\n");
            printf("|%14ld | %-21s |%20.2lf |\n", user[i].userID, user[i].name, total);
            printf("+-------------------------------------------------------------+\n");
        }
    }
    if (flag == 0)
        printf("No specific transaction at given dates.\n");
}

/*
    Function "show_shopaholics" Ask the user to enter a start and end date range and
    reads transaction records from a binary file named "Transactions.dat". Calculates
    the total spending of each user during the specified date range by comparing each
    transaction's date with the entered start and end dates. If the total spending of
    a user is greater than zero, it is printed along with the user ID and name.

    @param user - An array of infoType struct representing all the user information in the system.
    @param transaction - transactionType struct information of the transactions
    @param numberOfUser -  Used in the loop that determines the last index in the user array.
*/
void show_shopaholics(infoType user[], transactionType transaction, int numberOfUser)
{
    FILE *transactionFile;
    dateType startDate, endDate;
    double total;
    transactionType transactionTemp[MAX];
    int count = 0;
    int i, j;
    int flag = 0;
    get_dateRange(&startDate, &endDate);

    transactionFile = fopen("Transactions.dat", "rb");
    if (transactionFile == NULL)
        printf("Failed to open file\n");
    else
        while (fread(&transactionTemp[count], sizeof(transactionType), 1, transactionFile) == 1)
            count++;
    fclose(transactionFile);

    for (i = 0; i < numberOfUser; i++)
    {
        total = 0;
        for (j = 0; j < count; j++)
        {
            if (startDate.year == transactionTemp[j].date.year &&
                user[i].userID == transactionTemp[j].buyerID)
            {
                if (startDate.month == transactionTemp[j].date.month &&
                    startDate.day <= transactionTemp[j].date.day)
                    total += transactionTemp[j].totalPrice;
                else if (startDate.month < transactionTemp[j].date.month)
                    total += transactionTemp[j].totalPrice;
            }
            else if (endDate.year == transactionTemp[j].date.year &&
                     user[i].userID == transactionTemp[j].buyerID)
            {
                if (endDate.month == transactionTemp[j].date.month && endDate.day >= transactionTemp[j].date.day)
                    total += transactionTemp[j].totalPrice;
                else if (endDate.month > transactionTemp[j].date.month)
                    total += transactionTemp[j].totalPrice;
            }
            else if (startDate.year < transactionTemp[j].date.year &&
                     endDate.year > transactionTemp[j].date.year && user[i].userID == transactionTemp[j].buyerID)
                total += transactionTemp[j].totalPrice;
        }
        if (total > 0)
        {
            flag = 1;
            printf("+------------------------------------------------------+\n");
            printf("|   BuyerID   |      Buyer Name      |  Total Spending |\n");
            printf("+------------------------------------------------------+\n");
            printf("|%13ld| %-20s |%15.2lf  |\n", user[i].userID, user[i].name, total);
            printf("+------------------------------------------------------+\n");
        }
    }
    if (flag == 0)
        printf("No specific transaction at given dates.\n");
}

/*
    Function "admin_menu" displays the administrator menu and prompts for a password.
    If the password is correct, the administrator is given access to various options,

    @param user - An array of infoType struct representing all the user information in the system.
    @param numberOfUser -  Used in the loop that determines the last index in the user array.
*/
void admin_menu(infoType user[], int numberOfUser)
{
    str10 password;
    int choice = 0;
    transactionType transaction;

    printf("--------ADMINISTRATOR LOGIN PAGE--------\n");
    printf("Password: ");
    scanf("%s", password);

    if (strcmp(password, "H3LLo?") == 0)
    {
        printf("\nSelect services:\n");
        printf("[1] Show All Users\n");
        printf("[2] Show All Sellers\n");
        printf("[3] Show Total Sales in Given Duration\n");
        printf("[4] Show Sellers Sales\n");
        printf("[5] Show Shopaholics\n");
        printf("[6] Back to Main Menu\n");
        printf("-----------------------------------------\n");
        printf("Choice: ");
        scanf("%d", &choice);

        if (choice == 1)
            show_allUser(user, numberOfUser);
        else if (choice == 2)
            show_allSeller(user, numberOfUser);
        else if (choice == 3)
            printf("\nTotal Sales in this duration is: %.2f\n",
                   total_salesDuration(transaction));
        else if (choice == 4)
            show_sellerSales(user, transaction, numberOfUser);
        else if (choice == 5)
            show_shopaholics(user, transaction, numberOfUser);
    }
    else
        printf("Unauthorized access not allowed\n");
}

/*
    Function "readFile_user" reads the user information from a text file called "Users.txt".
    It updates the user array with the information read from the file and sets the number of users.

    @param user - An array of infoType struct representing all the user information in the system.
    @param *numberOfUser - A pointer to update the numberOfUsers representing the number
    of users in the system.
*/

void readFile_user(infoType user[], int *numberOfUser)
{
    int i = 0;
    FILE *userFile;

    userFile = fopen("Users.txt", "r"); // Open file in read mode
    if (userFile == NULL)
        printf("Failed to open file\n");
    else
        for (i = 0; fscanf(userFile, "%ld", &user[i].userID) != EOF; i++)
        {
            // Read the rest of the data for the user
            fscanf(userFile, " %s", user[i].password); // second space use to match space after userID
            fscanf(userFile, " %[^\n]", user[i].name);
            fscanf(userFile, " %[^\n]", user[i].address);
            fscanf(userFile, " %ld", &user[i].contact);
        }
    *numberOfUser = i; // Update the number of users

    fclose(userFile); // Close the file
}

/*
    Function "writeFile_user" writes the users information from the infoType array
    to a text file called "Users.txt".

    @param user - An array of infoType struct representing all the user information in the system.
    @param numberOfUser - Used in the loop that determines the last index in the user array.
*/
void writeFile_user(infoType user[], int numberOfUser)
{
    int i;
    FILE *userFile;

    // checkpoint
    userFile = fopen("Users.txt", "w");
    if (userFile == NULL)
        printf("Failed to open Users file\n");
    else
        for (i = 0; i < numberOfUser; i++)
        {
            fprintf(userFile, "%ld %s\n", user[i].userID, user[i].password);
            fprintf(userFile, "%s\n", user[i].name);
            fprintf(userFile, "%s\n", user[i].address);
            fprintf(userFile, "%ld\n\n", user[i].contact);
        }

    fclose(userFile);
}

/*
    Function "readFile_product" reads the item information from a text file called "Items.txt".
    It updates each user's list of items and all productID with the item information read from the file.

   @param user[] - Struct arrays of user that stores their information.
   @param *itemTracker - itemTrackerType struct pointer to pass all of the product information
   in the system.
   @param numberOfUser - Used in the loop that determines the last index in the user array.
*/
void readFile_product(infoType user[], itemTrackerType *itemTracker, int numberOfUser)
{
    int i = 0;
    FILE *productFile;
    int itemIndex; // return countnew
    long productIDTemp;
    long sellerIDTemp;
    int found;

    productFile = fopen("Items.txt", "r");
    if (productFile == NULL)
        printf("Failed to open Items file\n");
    else
    {
        while (fscanf(productFile, "%ld", &productIDTemp) == 1)
        {
            fscanf(productFile, " %ld", &sellerIDTemp);
            found = binarySearch_user(user, numberOfUser, sellerIDTemp);
            itemIndex = user[found].productCount;
            // read the rest of the item information

            // update users Item
            user[found].item[itemIndex].productID = productIDTemp;
            fscanf(productFile, " %[^\n]", user[found].item[itemIndex].itemName);
            fscanf(productFile, " %[^\n]", user[found].item[itemIndex].category);
            fscanf(productFile, " %[^\n]", user[found].item[itemIndex].description);
            fscanf(productFile, "%d", &user[found].item[itemIndex].quantity);
            fscanf(productFile, " %f", &user[found].item[itemIndex].price);
            user[found].productCount++;

            // updates all productID item information
            itemTracker->allProductID[i].productID = productIDTemp;
            itemTracker->allProductID[i].sellerID = sellerIDTemp;
            strcpy(itemTracker->allProductID[i].itemName,
                   user[found].item[itemIndex].itemName);
            strcpy(itemTracker->allProductID[i].category,
                   user[found].item[itemIndex].category);
            strcpy(itemTracker->allProductID[i].description,
                   user[found].item[itemIndex].description);
            itemTracker->allProductID[i].quantity = user[found].item[itemIndex].quantity;
            itemTracker->allProductID[i].price = user[found].item[itemIndex].price;
            itemTracker->allProductCount++;
            i++;
        }
    }
    fclose(productFile); // Close the file
}

/*
    Function "writeFile_product" writes all of the product information in the system
    to a text file named "Items.txt". This function first opens the file in "w" (write) mode,
    and then iterates through each product in the allProductID array of the itemTrackerType struct.

    @param itemTracker - ItemTrackerType struct representing all of the product information in the system.
    @param numberOfUser - Used in the loop that determines the last index in the user array.
*/
void writeFile_product(itemTrackerType itemTracker, int numberOfUser)
{
    int i;
    FILE *productFile;
    // checkpoint na mamali sorting ng user ID, display ng search product din ayusin.
    productFile = fopen("Items.txt", "w");
    if (productFile == NULL)
        printf("Failed to open file\n");
    else
        for (i = 0; i < itemTracker.allProductCount; i++)
        {
            fprintf(productFile, "%ld %ld\n", itemTracker.allProductID[i].productID,
                    itemTracker.allProductID[i].sellerID);
            fprintf(productFile, "%s\n", itemTracker.allProductID[i].itemName);
            fprintf(productFile, "%s\n", itemTracker.allProductID[i].category);
            fprintf(productFile, "%s\n", itemTracker.allProductID[i].description);
            fprintf(productFile, "%d %.2f\n\n", itemTracker.allProductID[i].quantity,
                    itemTracker.allProductID[i].price);
        }

    fclose(productFile); // Close the file
}

/*
    Function "writeBinaryFIle_transaction" writes the transaction information
    into the binary file "Transactions.dat" in append mode.

    @param transaction - TransactionType struct representing the transaction information
    that needs to be written into the file.
*/
void writeBinaryFIle_transaction(transactionType transaction)
{
    FILE *transactionFile;

    transactionFile = fopen("Transactions.dat", "ab");
    if (transactionFile == NULL)
        printf("Failed to open file\n");
    else
        fwrite(&transaction, sizeof(transactionType), 1, transactionFile);

    fclose(transactionFile);
}

int main()
{
    int service = 0;
    int userCount = 0;
    infoType user[MAX];
    transactionType transaction;
    itemTrackerType itemTracker;

    readFile_user(user, &userCount);
    readFile_product(user, &itemTracker, userCount);

    while (service != 4)
    {
        service = mode();
        if (service == 1 && userCount < 100)
            register_user(user, &userCount);
        else if (service == 1 && userCount >= 100)
            printf("System haved reached maximum user.");
        else if (service == 2)
            user_menu(user, &itemTracker, &transaction, userCount);
        else if (service == 3)
            admin_menu(user, userCount);
    }

    sort_userID(user, userCount);
    writeFile_user(user, userCount);
    sort_allProductID(&itemTracker);
    writeFile_product(itemTracker, userCount);

    return 0;
}
