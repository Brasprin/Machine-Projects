*** Settings ***
Library           SeleniumLibrary

*** Variables ***
${POSITIVE_INTEGER}     100
${FLOAT_VALUE}          123.45
${NEGATIVE_VALUE}       -50

*** Keywords ***
Navigate To Set Defaults Page
    Click Element            id:set-default-button

Set Default Rate To Value 
    [Arguments]              ${value}
    Wait Until Element Is Visible    id:rate-field    5s
    Input Text               id:rate-field      ${value}
    Input Text               id:basic-field     ${value}
    Execute JavaScript       document.getElementById("confirm-button").scrollIntoView()
    Click Button             id:confirm-button

Should See Success Message
    Wait Until Page Contains    Defaults updated successfully   

Should See Error Message
    Wait Until Page Contains    Invalid input    