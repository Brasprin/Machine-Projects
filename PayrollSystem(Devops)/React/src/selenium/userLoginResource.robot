*** Settings ***
Library           SeleniumLibrary

*** Variables ***
${URL}                https://ledgerly-ochre.vercel.app/
${BROWSER}            Chrome
${VALID_USERNAME}     DLSU admin
${VALID_PASSWORD}     123
${INVALID_USERNAME}   wronguser
${INVALID_PASSWORD}   wrongpass

*** Keywords ***
Open Login Page
    ${options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
    Call Method    ${options}    add_argument    --headless
    Call Method    ${options}    add_argument    --no-sandbox
    Call Method    ${options}    add_argument    --disable-dev-shm-usage
    Call Method    ${options}    add_argument    --disable-gpu
    Create WebDriver    Chrome    options=${options}
    Go To    ${URL}
    Maximize Browser Window

Login With Valid Credentials
    Input Text    css:input[placeholder="Username"]     ${VALID_USERNAME}
    Input Text    css:input[placeholder="Password"]     ${VALID_PASSWORD}
    Click Button  id:login-button
    
Login With Invalid Credentials
    Input Text    css:input[placeholder="Username"]     ${INVALID_USERNAME}
    Input Text    css:input[placeholder="Password"]     ${INVALID_PASSWORD}
    Click Button  id:login-button

Should Be Redirected To Main Menu
    Wait Until Location Contains    /MainMenu    

Should Stay On Login Page With Error
    Wait Until Page Contains    Invalid username or password   