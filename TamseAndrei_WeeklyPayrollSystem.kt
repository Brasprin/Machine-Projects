/*
    Weekly Payroll System (MACHINE PROJECT)
    ********************
    Name:  Andrei G. Tamse
    Language: Kotlin
    Paradigm(s): Object Oriented Programming, Functional Programming , and Procedural Programming
    Group Number and Section: GROUP 2 - S18
    ********************
*/

/**
 * Data class representing the payroll information of an employee.
 *
 * @property dailySalary Default daily base salary of the employee.
 * @property inTime Default in-time of the employee in 24-hour format.
 * @property outTime Default out-time of the employee in 24-hour format.
 * @property salaryRates Salary rates for the employee.
 * @property dayType The type of day (e.g., "Normal Day").
 * @property weeklySalary Calculated weekly salary of the employee.
 * @property numberOfWorkDays The number of workdays in a week of the employee.
 */
data class Payroll(
    var dailySalary: Double = 500.0,
    var inTime: Int = 900,
    var outTime: Int = 900,
    var salaryRates: Double = 0.0,
    var dayType: String = "Normal Day",
    var weeklySalary: Double = 0.0,
    var numberOfWorkDays: Int = 0
)

fun main() {
    println("Welcome to Weekly Payroll System!")
    val payroll = Payroll()
    var choice: Int
    var i = 0

    do{
        choice = chooseMode()

        when (choice) {
            1 -> {
                updatePayroll(payroll)
                i++
            }
            2 -> modifyConfig(payroll)
            3 -> {
                displayTotalSalary(payroll.weeklySalary)
                return
            }
            else -> println("Invalid mode.")
        }
    } while (i < 7)

    displayTotalSalary(payroll.weeklySalary)
}

/**
 * Prompts the user to choose a mode and returns the selected mode.
 *
 * @return The selected mode:
 *   - 1 for Payroll Mode
 *   - 2 for Modify Default Configuration
 *   - 3 for Exit
 */
fun chooseMode(): Int {
    println("\nChoose Mode:")
    println("[1] Payroll Mode")
    println("[2] Modify Default Configuration")
    println("[3] Exit")
    print("Enter Choice: ")

    return scanInt()
}

/**
 * Calculates the number of night shift hours between the given in-time and out-time.
 *
 * @param inTime The in-time in 24-hour format.
 * @param outTime The out-time in 24-hour format.
 * @return The number of night shift hours worked.
 */
@OptIn(kotlin.ExperimentalStdlibApi::class)
fun getNightShiftHours(inTime: Int, outTime: Int): Int {
    val nightShiftStart = 22             // hour format
    val nightShiftEnd = 6
    val workHours = getWorkHours(inTime, outTime)
    var currentTime = inTime / 100
    var nightShiftHours = 0

    for (i in 0..<workHours) {
        currentTime++
        // Check if the current hour is within the night shift period and night shift hours limit.
        if ((currentTime > nightShiftStart || currentTime <= nightShiftEnd) && nightShiftHours < 8)
            nightShiftHours++
    }
    return nightShiftHours
}

/**
 * Calculates the total work hours between the given in-time and out-time.
 *
 *
 * @param inTime The in-time in 24-hour format.
 * @param outTime The out-time in 24-hour format.
 * @return The total work hours between in-time and out-time.
 */
fun getWorkHours(inTime: Int, outTime: Int): Int{
    if (outTime == 0)
        return (2400 - inTime) / 100
    else if (inTime == outTime || outTime == 900)
        return 0
    else if (inTime < outTime)
        return (outTime - inTime) / 100

    return ((2400 - inTime) + outTime) / 100        // Divide by 100 to return hour format
}

/**
 * Calculates the overtime hours worked between the given in-time and out-time.
 *
 * @param inTime The in-time in 24-hour format.
 * @param outTime The out-time in 24-hour format.
 * @return The number of overtime hours worked.
 */
fun getOverTime(inTime: Int, outTime: Int): Int {
    val workHours = getWorkHours(inTime, outTime)

    if (workHours > 8)
        return workHours - 9

    return workHours
}

/**
 * Updates the payroll information for a workday and calculates the total salary.
 *
 * @param payroll The data class payroll containing information of an employee.
 */
fun updatePayroll(payroll: Payroll){
    var choice: Int

    do {
        println("Work Day ${payroll.numberOfWorkDays + 1}")
        updateOutTime(payroll)
        val workhours = getWorkHours(payroll.inTime, payroll.outTime)
        if (workhours > 8)
            payroll.numberOfWorkDays++
        else if (payroll.outTime == 900){
            println("\nWork Day ${payroll.numberOfWorkDays + 1}: Marked as absent.")
            return
        }
        else
            println("8 hours is the minimum work hours.\n")
    }while (workhours < 9)

    do {
        println("\nChoose Day Type:")
        println("[1] Normal Day")
        println("[2] Special Non-Working Day")
        println("[3] Regular Holiday")
        print("Enter Choice: ")
        choice = scanInt()
        if (choice > 3)
            println("Invalid Mode")
    } while (choice !in 1..3)

    val overTimeHours = getOverTime(payroll.inTime, payroll.outTime)
    val nightShiftHours = getNightShiftHours(payroll.inTime, payroll.outTime)
    val morningShiftOvertime = overTimeHours - nightShiftHours
    var secondSalaryRate = 0.0

    // Assign new salary rates if there is morning shift overtime
    when (choice) {
        1 -> payroll.salaryRates = if (morningShiftOvertime != 0 && payroll.numberOfWorkDays <= 4) 1.25 else 1.69
        2 -> payroll.salaryRates = if (morningShiftOvertime != 0 && payroll.numberOfWorkDays <= 4) 1.69 else 1.95
        3 -> payroll.salaryRates = if (morningShiftOvertime != 0 && payroll.numberOfWorkDays <= 4) 2.6 else 3.38
    }

    // Assign new salary rates if there is night shift overtime
    if (nightShiftHours != 0) {
        secondSalaryRate = payroll.salaryRates  // If there are 2 salary rates in a day, second salary date will be updated
        when (choice) {
            1 -> payroll.salaryRates = 1.375
            2 -> payroll.salaryRates = if (payroll.numberOfWorkDays <= 4) 1.859 else 2.145
            3 -> payroll.salaryRates = if (payroll.numberOfWorkDays <= 4) 2.86 else 3.718
        }
    }

    // Calculate the base salary based on the day type of the work
    var specialSalary = 0.0
    if (payroll.numberOfWorkDays <= 4)      // Workdays less than 4 means not rest day
        when (choice ) {
            1 -> {
                payroll.dayType = "Normal Day"
                specialSalary = payroll.dailySalary
            }

            2 -> {
                payroll.dayType = "SNWH"
                specialSalary = payroll.dailySalary * 1.3
            }

            3 -> {
                payroll.dayType = "Regular Holiday"
                specialSalary = payroll.dailySalary * 2.0
            }
        }
    else
        when (choice ) {
            1 -> {
                payroll.dayType = "Rest Day"
                specialSalary = payroll.dailySalary * 1.3
            }
            2 -> {
                payroll.dayType = "SNWH, Rest Day"
                specialSalary = payroll.dailySalary * 1.5
            }
            3 -> {
                payroll.dayType = "RH and Rest Day"
                specialSalary = payroll.dailySalary * 2.6
            }
        }

    showPayroll(payroll, specialSalary, secondSalaryRate)
}

/**
 * Displays the payroll computation for a workday and updates the weekly salary.
 *
 * @param payroll The data class payroll containing information of an employee.
 * @param specialSalary The special base salary rate for the day.
 * @param secondRate The secondary salary rate for 2 salary rates in a day.
 */
fun showPayroll(payroll: Payroll, specialSalary: Double, secondRate : Double) {
    val nightShiftHour = getNightShiftHours(payroll.inTime, payroll.outTime)
    var morningShiftOvertime = getOverTime(payroll.inTime, payroll.outTime) - nightShiftHour

    val morningOvertimeSalary: Double = if (nightShiftHour > 0)
        morningShiftOvertime * payroll.dailySalary / 8 * secondRate
    else
        morningShiftOvertime * payroll.dailySalary / 8 * payroll.salaryRates

    val nightOverTimeSalary = nightShiftHour * payroll.dailySalary / 8 * payroll.salaryRates

    val totalSalary: Double = if (getOverTime(payroll.inTime, payroll.outTime) == 0 && nightShiftHour != 0) {
        val nightShiftHourSalary = nightShiftHour * specialSalary / 8 * 1.10
        specialSalary + nightShiftHourSalary
    } else
        specialSalary + morningOvertimeSalary + nightOverTimeSalary

    payroll.weeklySalary += totalSalary
    val formattedTotalSalary = String.format("%.2f", totalSalary)
    var startTime = payroll.inTime
    var endTime = startTime + 900
    endTime = normalizeTime(endTime)
    if (morningShiftOvertime < 0)
        morningShiftOvertime = 0

    println("\n=============================================================")
    println("| Day ${payroll.numberOfWorkDays}                 SALARY COMPUTATION                  |")
    println("=============================================================")
    println("| Daily Rate                       |  ${String.format("%20s", payroll.dailySalary)}  |")
    println("-------------------------------------------------------------")
    println("| IN Time                          | ${String.format("%20s", formatMilitaryTime(payroll.inTime))}   |")
    println("-------------------------------------------------------------")
    println("| OUT Time                         | ${String.format("%20s", formatMilitaryTime(payroll.outTime))}   |")
    println("-------------------------------------------------------------")
    println("| Day Type                         |${String.format("%21s", payroll.dayType)}   |")
    println("-------------------------------------------------------------")
    if (morningShiftOvertime == 0)
        println("| Hours on Night Shift             |  ${String.format("%20s", nightShiftHour)}  |")
    else
        println(
            "| Hours Overtime (Night Shift OT)  |                 ${String.format("%s (%s)", morningShiftOvertime, nightShiftHour)
            }  |"
        )
    println("-------------------------------------------------------------")
    println("| Salary for the day               | ${String.format("%21s", formattedTotalSalary)}  |")
    println("=============================================================")
    println("| Computation                                               |")
    println("-------------------------------------------------------------")
    if (payroll.dailySalary == specialSalary)
        println("| Daily Rate                       | $startTime - ${formatMilitaryTime(endTime)} " +
                "|  $specialSalary   |")
    else {
        println("| Daily Rate x ${payroll.dayType}           | $startTime - ${formatMilitaryTime(endTime)} " +
                "|  $specialSalary   |")
        println("|       = ${payroll.dailySalary} x ${payroll.salaryRates}            |             |          |")
    }
    if (morningShiftOvertime > 0) {
        startTime = endTime
        endTime += morningShiftOvertime * 100
        endTime = normalizeTime(endTime)
        println("-------------------------------------------------------------")
        println("| Hours OT x OT Hourly Rate        | $startTime - ${formatMilitaryTime(endTime)} " +
                "|  ${"%4.2f".format(morningOvertimeSalary)}  |")
        if (secondRate == 0.0)
            println("|       = $morningShiftOvertime x ${payroll.dailySalary} / 8 x ${payroll.salaryRates}     " +
                    "|             |          |")
        else
            println("|       = $morningShiftOvertime x ${payroll.dailySalary} / 8 x $secondRate     " +
                    "|             |           |")
    }
    if (nightOverTimeSalary > 0) {
        startTime = endTime
        endTime += nightShiftHour * 100
        endTime = normalizeTime(endTime)
        println("-------------------------------------------------------------")
        println("| Hours OT x NS-OT Hourly Rate     | $startTime - ${formatMilitaryTime(endTime)} " +
                "|  ${"%4.2f".format(nightOverTimeSalary)}  |")
        println("|       = $nightShiftHour x ${payroll.dailySalary} / 8 x ${payroll.salaryRates}    " +
                "|             |           |")
    }
    println("-------------------------------------------------------------\n")
}

/**
 * Displays the total weekly salary.
 *
 * @param weeklySalary The total weekly salary to be displayed.
 */
fun displayTotalSalary(weeklySalary: Double) {
    val formattedSalary = String.format("%.2f", weeklySalary)
    println("\n=============================================================")
    println("|  Total Weekly Salary             ${String.format("%20s", formattedSalary)}     |")
    println("=============================================================")
}

/**
 * Modifies the configuration options of the payroll.
 *
 * @param payroll The data class payroll containing information of an employee.
 */
fun modifyConfig(payroll: Payroll) {

    println("\nDaily Salary: ${payroll.dailySalary}")
    println("Current InTime: ${payroll.inTime}\n")
    println("Select Modification Option:")
    println("[1] Adjust Salary")
    println("[2] Update InTime")
    println("[3] Exit")
    print("Enter Choice: ")

    val choice: Int = scanInt()

    if (choice == 1)
        adjustSalary(payroll)
    else if (choice == 2)
        updateInTime(payroll)

}

/**
 * Formats a military time (24-hour format) as a string with leading zeros if needed.
 *
 * @param time The military time to be formatted.
 * @return The formatted time as a string.
 */
fun formatMilitaryTime(time: Int): String {
    return if (time == 0)
        "000$time"
    else if (time < 1000)
        "0$time"
    else
        time.toString()
}

/**
 * Normalizes the given time to the 24-hour format by adjusting it to the next day if it's greater than or equal to 2400.
 *
 * @param endTime The time to be normalized.
 * @return The normalized time in 24-hour format.
 */
fun normalizeTime(endTime: Int): Int {
    return if (endTime >= 2400)
        endTime - 2400
    else
        endTime
}

/**
 * Adjusts the daily salary of the payroll.
 *
 * @param payroll The data class payroll containing information of an employee.
 */
fun adjustSalary(payroll: Payroll) {
    print("Enter New Salary: ")
    payroll.dailySalary = scanDouble()
    println("Salary updated to ${payroll.dailySalary}")
}

/**
 * Updates the InTime of the payroll in military time format (HHMM).
 *
 * @param payroll The data class payroll containing information of an employee.
 */
fun updateInTime(payroll: Payroll) {
    print("Enter New InTime (HHMM): ")
    payroll.inTime = scanMilitaryTime()
    println("InTime updated to ${formatMilitaryTime(payroll.inTime)}")
}

/**
 * Updates the OutTime of the payroll in military time format (HHMM).
 *
 * @param payroll The data class payroll containing information of an employee.
 */
fun updateOutTime(payroll: Payroll) {
    print("Enter OutTime (HHMM): ")
    payroll.outTime = scanMilitaryTime()
}

/**
 * Scans and validates user input for military time (24-hour format) and returns it as an integer.
 * The function enforces the format HHMM that is valid time range (0000 to 2359).
 *
 * @return The user-input military time as an integer.
 */
fun scanMilitaryTime(): Int {
    var input: Int

    do {
        val inputString: String? = readLine()
        input = inputString?.toIntOrNull() ?: -1

        if (input == -1 || (inputString != null && (inputString.length != 4 || input < 0 || input > 2359 || input % 100 >= 60))){
            input = -1
            print("Invalid input. Please enter a valid military time (HHMM): ")
        }
    } while (input == -1)

    return input
}

/**
 * Scans and validates user input for an integer and returns it.
 *
 * @return The user-input integer, or 0 if the input is invalid or not provided.
 */
fun scanInt(): Int {
    val inputString: String? = readLine()
    return inputString?.toIntOrNull() ?: 0
}

/**
 * Scans and validates user input for a double and returns it.
 *
 * @return The user-input double, or 0.0 if the input is invalid or not provided.
 */
fun scanDouble(): Double {
    val inputString: String? = readLine()
    return inputString?.toDoubleOrNull() ?: 0.0
}