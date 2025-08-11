*** Settings ***
Documentation     Test cases for View Payroll
Resource          userLoginResource.robot
Resource          viewPayrollHistoryResource.robot
Library           SeleniumLibrary

*** Test Cases ***
AT-08: User input query is composed of valid values
    Open Login Page
    Login With Valid Credentials
    Should Be Redirected To Main Menu
    Navigate To View Payroll Page
    Query with valid input
    [Teardown]      Close Browser

AT-09: User input query is composed of invalid values
    Open Login Page
    Login With Valid Credentials
    Should Be Redirected To Main Menu
    Navigate To View Payroll Page
    Query with invalid input
    [Teardown]      Close Browser
