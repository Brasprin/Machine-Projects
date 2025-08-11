*** Settings ***
Documentation     Test cases for Add Employee
Library     SeleniumLibrary
Resource    userLoginResource.robot
Resource    addEmployeeResource.robot

*** Test Cases ***
AT-10: User input query is composed of valid values
    Open Login Page
    Login With Valid Credentials
    Should Be Redirected To Main Menu
    Navigate To Add Employee Page
    Fill Out Employee Personal Info     
    ...    ${VALID_FIRST_NAME}
    ...    ${VALID_MIDDLE_NAME}
    ...    ${VALID_LAST_NAME}
    ...    ${VALID_PHONE}
    ...    ${VALID_EMAIL}
    Fill Out Employee Company Info      
    ...    ${VALID_DEPARTMENT}        
    ...    ${VALID_POSITION}          
    ...    ${VALID_DESIGNATION}       
    ...    ${VALID_BASIC_SALARY}
    Set Employee Hiring Date       
    Fill Out Employee Bank Info
    ...    ${VALID_BANK_NAME}         
    ...    ${VALID_ACCOUNT_NUMBER}    
    ...    ${VALID_BRANCH}            
    Submit Employee Form
    [Teardown]      Close Browser

AT-11: User input query is composed of invalid values 
    Open Login Page
    Login With Valid Credentials
    Should Be Redirected To Main Menu
    Navigate To Add Employee Page
    Fill Out Employee Personal Info     
    ...    ${INVALID_FIRST_NAME}
    ...    ${INVALID_MIDDLE_NAME}
    ...    ${INVALID_LAST_NAME}
    ...    ${INVALID_PHONE}
    ...    ${INVALID_EMAIL}
    Fill Out Employee Company Info        
    ...    ${INVALID_DEPARTMENT}        
    ...    ${INVALID_POSITION}          
    ...    ${INVALID_DESIGNATION}       
    ...    ${INVALID_BASIC_SALARY}  
    Set Employee Hiring Date       
    Fill Out Employee Bank Info
    ...    ${INVALID_BANK_NAME}         
    ...    ${INVALID_ACCOUNT_NUMBER}    
    ...    ${INVALID_BRANCH}   
    Submit Employee Form
    [Teardown]      Close Browser
