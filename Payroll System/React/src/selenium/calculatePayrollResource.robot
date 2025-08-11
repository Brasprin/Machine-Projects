*** Settings ***
Library     SeleniumLibrary

*** Variables ***
${EMPLOYEE-1}       111
${EMPLOYEE-2}       Iker
${EMPLOYEE-3}       Scott

${INVALID-1}       -111
${INVALID-2}       asdadasdada
${INVALID-3}       qwdxcqwsdas

*** Keywords ***
Navigate To Calculate Payroll Page
    Click Element            id:calculate-payroll-button

Query with valid input
    Input Text          id:id-field         ${EMPLOYEE-1}
    Click Button        id:search-by-id-button
    Wait Until Page Contains        jdoe@gmail.com
    Input Text          id:fname-field      ${EMPLOYEE-2}
    Click Button        id:search-by-fname-button
    Wait Until Page Contains        iventura@gmail.com
    Input Text          id:lname-field      ${EMPLOYEE-3}
    Click Button        id:search-by-lname-button
    Wait Until Page Contains        zscott@gmail.com

Query with invalid input
    [Documentation]     The inputs for text fields are not necessarily invalid but should be non-existent; it should simply show that they fail safely
    Input Text          id:id-field         ${INVALID-1}
    Click Button        id:search-by-id-button
    Wait Until Page Contains        No results found for the search criteria
    Input Text          id:fname-field      ${INVALID-2} 
    Click Button        id:search-by-fname-button
    Wait Until Page Contains        No results found for the search criteria
    Input Text          id:lname-field      ${INVALID-3}
    Click Button        id:search-by-lname-button
    Wait Until Page Contains        No results found for the search criteria
