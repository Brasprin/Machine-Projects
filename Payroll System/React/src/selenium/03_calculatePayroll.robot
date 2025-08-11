*** Settings ***
Documentation     Test cases for Calculate Payroll
Resource          userLoginResource.robot
Resource          calculatePayrollResource.robot
Library           SeleniumLibrary

*** Test Cases ***
AT-06: Generate Payroll With Valid Inputs
    Open Login Page
    Login With Valid Credentials
    Should Be Redirected To Main Menu
    Navigate To Calculate Payroll Page
    Query with valid input
    [Teardown]      Close Browser

AT-07: Set Default Rate With Floating Point Value
    Open Login Page
    Login With Valid Credentials
    Should Be Redirected To Main Menu
    Navigate To Calculate Payroll Page
    Query with invalid input
    [Teardown]      Close Browser
