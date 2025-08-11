*** Settings ***
Documentation     Test cases for User Login 
Resource          userLoginResource.robot
Library           SeleniumLibrary

*** Test Cases ***
AT-01: User Login With Valid Credentials
    Open Login Page
    Login With Valid Credentials
    Should Be Redirected To Main Menu
    [Teardown]      Close Browser

AT-02: User Login With Invalid Credentials
    Open Login Page
    Login With Invalid Credentials
    Should Stay On Login Page With Error
    [Teardown]      Close Browser

