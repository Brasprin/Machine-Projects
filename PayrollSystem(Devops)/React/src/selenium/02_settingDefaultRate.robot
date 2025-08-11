*** Settings ***
Documentation     Test cases for Setting Default Rate 
Resource          userLoginResource.robot
Resource          settingDefaultRateResource.robot
Library           SeleniumLibrary

*** Test Cases ***
AT-03: Set Default Rate With Positive Integer
    Open Login Page
    Login With Valid Credentials
    Should Be Redirected To Main Menu
    Navigate To Set Defaults Page
    Set Default Rate To Value    ${POSITIVE_INTEGER}

    [Teardown]      Close Browser

AT-04: Set Default Rate With Floating Point Value
    Open Login Page
    Login With Valid Credentials
    Should Be Redirected To Main Menu
    Navigate To Set Defaults Page
    Set Default Rate To Value    ${FLOAT_VALUE}

    [Teardown]      Close Browser

AT-05: Set Default Rate With Negative Value
    Open Login Page
    Login With Valid Credentials
    Should Be Redirected To Main Menu
    Navigate To Set Defaults Page
    Set Default Rate To Value    ${NEGATIVE_VALUE}

    [Teardown]      Close Browser
