DROP DATABASE IF EXISTS entompestcontrol;
CREATE DATABASE entompestcontrol;

DROP SCHEMA IF EXISTS entompestcontrol;
CREATE SCHEMA IF NOT EXISTS entompestcontrol;
USE entompestcontrol;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 10, 2024 at 05:40 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET SQL_MODE='ALLOW_INVALID_DATES';
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `entompestcontrol`
--

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `address_id` int(11) NOT NULL,
  `customer_code` int(11) NOT NULL,
  `address_function` varchar(50) NOT NULL DEFAULT 'Service',
  `address_name` varchar(50) DEFAULT NULL,
  `street` varchar(255) NOT NULL,
  `village` varchar(255) DEFAULT NULL,
  `barangay` varchar(100) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `province` varchar(255) NOT NULL,
  `region` varchar(255) NOT NULL,
  `zip` varchar(4) DEFAULT NULL,
  `service_area` int(11) DEFAULT NULL,
  `area_of_responsibility` varchar(50) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_updated` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `addresschoices`
--

CREATE TABLE `addresschoices` (
  `id` int(11) NOT NULL,
  `barangay` text NOT NULL,
  `citymun` text NOT NULL,
  `province` text NOT NULL,
  `region` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adonis_schema`
--

CREATE TABLE `adonis_schema` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `area_of_responsibility`
--

CREATE TABLE `area_of_responsibility` (
  `aor_id` int(11) NOT NULL,
  `area_id` int(11) NOT NULL,
  `aor_name` text NOT NULL,
  `status` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `barangays`
--

CREATE TABLE `barangays` (
  `id` int(10) UNSIGNED NOT NULL,
  `psgc_code` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `region_code` varchar(255) DEFAULT NULL,
  `province_code` varchar(255) DEFAULT NULL,
  `city_code` varchar(255) DEFAULT NULL,
  `brgy_code` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` int(10) UNSIGNED NOT NULL,
  `psgc_code` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contracts`
--

CREATE TABLE `contracts` (
  `customer_code` int(11) NOT NULL,
  `contract_id` int(11) NOT NULL,
  `addr_id` int(11) NOT NULL,
  `initial_treatment` date NOT NULL,
  `contract_period` varchar(50) NOT NULL,
  `contract_renewal_date` date NOT NULL,
  `warranty_period` text NOT NULL,
  `service_id` int(11) NOT NULL,
  `type_of_treatments` int(11) NOT NULL,
  `termination_date` date DEFAULT NULL,
  `termination_reason` varchar(255) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_updated` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contract_scheduletable`
--

CREATE TABLE `contract_scheduletable` (
  `id` int(11) NOT NULL,
  `type` text DEFAULT NULL,
  `mode` text DEFAULT NULL,
  `weekinterval` int(11) DEFAULT NULL,
  `weeklyfollowup` int(11) DEFAULT 4,
  `adhocfollowup` tinyint(1) DEFAULT 0,
  `adhocinterval` int(11) DEFAULT 0,
  `adhococcurrence` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `customer_code` int(11) NOT NULL,
  `leadsource` text DEFAULT NULL,
  `companyName` varchar(160) DEFAULT 'Individual',
  `fname` text DEFAULT NULL,
  `mname` text DEFAULT NULL,
  `lname` text DEFAULT NULL,
  `phone` text DEFAULT NULL,
  `phonetwo` text DEFAULT NULL,
  `landline` varchar(15) DEFAULT NULL,
  `landlinetwo` text DEFAULT NULL,
  `email` text DEFAULT NULL,
  `status` varchar(10) DEFAULT 'Prospect',
  `remarks` text DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_updated` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customerservicedata`
--

CREATE TABLE `customerservicedata` (
  `id` int(11) NOT NULL,
  `customerid` int(11) NOT NULL,
  `serviceid` int(11) NOT NULL,
  `servicedate` date NOT NULL,
  `serviceactualdate` date NOT NULL,
  `serviceteam` int(11) NOT NULL,
  `lastupdate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `id` int(11) NOT NULL,
  `employee_id` varchar(11) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `fname` varchar(255) NOT NULL,
  `mname` varchar(255) NOT NULL,
  `lname` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `designation` varchar(50) NOT NULL,
  `position` varchar(100) NOT NULL,
  `date_hired` date DEFAULT NULL,
  `rbacProfile` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employeeteam`
--

CREATE TABLE `employeeteam` (
  `id` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `teamName` varchar(64) DEFAULT NULL,
  `serviceArea` varchar(64) DEFAULT NULL,
  `aor` varchar(64) DEFAULT NULL,
  `teamleader` text DEFAULT NULL,
  `teammembera` text DEFAULT NULL,
  `teammemberb` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `generalformoptions`
--

CREATE TABLE `generalformoptions` (
  `id` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `optionname` text NOT NULL,
  `category` text NOT NULL,
  `link` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leadsource`
--

CREATE TABLE `leadsource` (
  `id` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `choice` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `provinces`
--

CREATE TABLE `provinces` (
  `id` int(10) UNSIGNED NOT NULL,
  `psgc_code` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rbacprofile`
--

CREATE TABLE `rbacprofile` (
  `rbacId` int(11) NOT NULL,
  `rbacName` varchar(64) DEFAULT NULL,
  `rbacStatus` tinyint(1) DEFAULT 1,
  `custIdentity` int(11) DEFAULT 0,
  `custArea` int(11) DEFAULT 0,
  `custContract` int(11) DEFAULT 0,
  `empIdentity` int(11) DEFAULT 0,
  `empReport` int(11) DEFAULT 0,
  `admPanel` int(11) DEFAULT 0,
  `admPermission` int(11) DEFAULT 0,
  `admChangePass` int(11) DEFAULT 0,
  `admReqChange` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `regions`
--

CREATE TABLE `regions` (
  `id` int(10) UNSIGNED NOT NULL,
  `psgc_code` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `remarks_log`
--

CREATE TABLE `remarks_log` (
  `id` int(11) NOT NULL,
  `timestamp` timestamp NULL DEFAULT current_timestamp(),
  `remarks` text DEFAULT NULL,
  `link` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `serviceoffer`
--

CREATE TABLE `serviceoffer` (
  `id` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `servicename` text NOT NULL,
  `subservicelink` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `customer_code` int(11) NOT NULL,
  `address_id` int(11) NOT NULL,
  `contract_id` int(11) NOT NULL,
  `tos` varchar(100) NOT NULL,
  `tot` varchar(100) NOT NULL,
  `mot` varchar(100) NOT NULL,
  `frequency` varchar(100) NOT NULL,
  `follow_up` varchar(100) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `dimensions` text NOT NULL,
  `allocated_chemicals` text NOT NULL,
  `actual_chemicals` text NOT NULL,
  `stations` text NOT NULL,
  `completion_date` date DEFAULT NULL,
  `tl_aor` varchar(50) DEFAULT NULL,
  `tl_onsite1` varchar(50) DEFAULT NULL,
  `tl_onsite2` varchar(50) DEFAULT NULL,
  `personnel1` varchar(50) DEFAULT NULL,
  `personnel2` varchar(50) DEFAULT NULL,
  `personnel3` varchar(50) DEFAULT NULL,
  `date_added` datetime NOT NULL DEFAULT current_timestamp(),
  `date_updated` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_area`
--

CREATE TABLE `service_area` (
  `area_id` int(11) NOT NULL,
  `area_name` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_contract`
--

CREATE TABLE `service_contract` (
  `id` int(11) NOT NULL,
  `status` int(1) DEFAULT 1 COMMENT '0 = Expired\r\n1 = Active\r\n2 = Cancelled',
  `customer_id` int(11) DEFAULT NULL,
  `customer_aid` int(11) DEFAULT NULL,
  `initialvisit_id` int(11) DEFAULT NULL,
  `proposalid` int(11) DEFAULT NULL,
  `targettreatmentdate` date DEFAULT NULL,
  `targettreatmenttime` text DEFAULT NULL,
  `typeofservice` text DEFAULT NULL,
  `typeoftreatment` text DEFAULT NULL,
  `modeoftreatment` text DEFAULT NULL,
  `warranty` int(11) DEFAULT NULL,
  `expiration` date DEFAULT NULL,
  `createddate` datetime DEFAULT current_timestamp(),
  `serviceplan` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_contract_files`
--

CREATE TABLE `service_contract_files` (
  `id` int(11) NOT NULL,
  `contractid` int(11) DEFAULT NULL,
  `file` mediumblob DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filetype` text DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_contract_remarks`
--

CREATE TABLE `service_contract_remarks` (
  `id` int(11) NOT NULL,
  `remarks` text DEFAULT NULL,
  `contractid` int(11) DEFAULT NULL,
  `ctimestamp` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_initialvisit`
--

CREATE TABLE `service_initialvisit` (
  `id` int(11) NOT NULL,
  `status` text DEFAULT NULL,
  `transactiondate` timestamp NULL DEFAULT NULL,
  `transactiontime` text DEFAULT NULL,
  `actualdate` timestamp NULL DEFAULT NULL,
  `actualtime` varchar(12) DEFAULT NULL,
  `targettreatmentdate` timestamp NULL DEFAULT NULL,
  `targettreatmenttime` varchar(12) DEFAULT NULL,
  `lastupdate` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `customer_id` varchar(12) DEFAULT NULL,
  `customer_aid` varchar(12) DEFAULT NULL,
  `salesanalyst` varchar(24) DEFAULT NULL,
  `teamassignment` int(11) DEFAULT NULL,
  `typeofservice` text DEFAULT NULL,
  `termitespecies` text DEFAULT NULL,
  `typeoftreatment` int(11) DEFAULT NULL,
  `modeoftreatment` int(11) DEFAULT NULL,
  `allottedstations` int(11) DEFAULT NULL,
  `areaofinfestation` text DEFAULT NULL,
  `linearmeter` text DEFAULT NULL,
  `dimensionofprotection` text DEFAULT NULL,
  `allottedchemicals` text DEFAULT NULL,
  `actualchemical` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_initialvisit_attachment`
--

CREATE TABLE `service_initialvisit_attachment` (
  `id` int(11) NOT NULL,
  `visitid` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filetype` text DEFAULT NULL,
  `file` mediumblob DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_proposal`
--

CREATE TABLE `service_proposal` (
  `id` int(11) NOT NULL,
  `status` tinyint(1) DEFAULT 1,
  `visitid` int(11) DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `filetype` text DEFAULT NULL,
  `file` mediumblob DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `datetime` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_proposal_files`
--

CREATE TABLE `service_proposal_files` (
  `id` int(11) NOT NULL,
  `proposal_id` int(11) NOT NULL,
  `file` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_schedule`
--

CREATE TABLE `service_schedule` (
  `id` int(11) NOT NULL,
  `contractid` int(11) DEFAULT NULL,
  `servicetype` int(11) DEFAULT NULL COMMENT '0 = Initial\r\n1 = Follow Up\r\n2 = QTR\r\n3 = Adhoc',
  `service_label` text DEFAULT NULL,
  `servicestatus` int(11) DEFAULT NULL COMMENT '0 = Todo\r\n1 = Assigned\r\n2 = In Progress\r\n3 = Done\r\n4 = Cancelled',
  `termite` tinyint(1) DEFAULT 1,
  `targetdate` timestamp NULL DEFAULT NULL,
  `origdate` timestamp NULL DEFAULT NULL,
  `scheduledate` timestamp NULL DEFAULT NULL,
  `actualdate` timestamp NULL DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `teamassignment` int(11) DEFAULT NULL,
  `lastupdate` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_schedule_remarks`
--

CREATE TABLE `service_schedule_remarks` (
  `id` int(11) NOT NULL,
  `schedule_id` int(11) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `remarksdate` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_treatment_scenario`
--

CREATE TABLE `service_treatment_scenario` (
  `id` int(11) NOT NULL,
  `typeoftreatment` text DEFAULT NULL,
  `modeoftreatment` text DEFAULT NULL,
  `taskscenario` text DEFAULT NULL,
  `taskdescription` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_treatment_scenario_fields`
--

CREATE TABLE `service_treatment_scenario_fields` (
  `id` int(11) NOT NULL,
  `linkid` int(11) DEFAULT NULL,
  `labeldescription` text DEFAULT NULL,
  `fieldname` text DEFAULT NULL,
  `visitinterval` int(11) DEFAULT NULL,
  `intervalunit` text DEFAULT NULL,
  `taskorder` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `treatment_schedule`
--

CREATE TABLE `treatment_schedule` (
  `schedule_id` int(11) NOT NULL,
  `customer_code` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `address_id` int(11) NOT NULL,
  `contract_id` int(11) NOT NULL,
  `mot` varchar(50) NOT NULL,
  `schedule` date NOT NULL,
  `confirmed_schedule` date DEFAULT NULL,
  `communication_log` varchar(255) DEFAULT NULL,
  `actual_date` date DEFAULT NULL,
  `status_of_infestation` varchar(255) DEFAULT NULL,
  `service_type` varchar(255) DEFAULT NULL,
  `tl_aor` varchar(11) DEFAULT NULL,
  `tl_onsite` varchar(11) DEFAULT NULL,
  `tl_onsite2` varchar(11) DEFAULT NULL,
  `personnel1` varchar(11) DEFAULT NULL,
  `personnel2` varchar(11) DEFAULT NULL,
  `personnel3` varchar(11) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_updated` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `employee_id` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `name` varchar(64) NOT NULL,
  `username` varchar(15) NOT NULL,
  `email` varchar(35) NOT NULL,
  `password` varchar(35) NOT NULL,
  `rbacProfile` int(11) DEFAULT NULL,
  `reqPassChange` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`address_id`),
  ADD KEY `address_ibfk_1` (`customer_code`);

--
-- Indexes for table `addresschoices`
--
ALTER TABLE `addresschoices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adonis_schema`
--
ALTER TABLE `adonis_schema`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `area_of_responsibility`
--
ALTER TABLE `area_of_responsibility`
  ADD PRIMARY KEY (`aor_id`);

--
-- Indexes for table `barangays`
--
ALTER TABLE `barangays`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contracts`
--
ALTER TABLE `contracts`
  ADD PRIMARY KEY (`contract_id`),
  ADD UNIQUE KEY `id` (`customer_code`,`contract_id`),
  ADD KEY `addr_id` (`addr_id`);

--
-- Indexes for table `contract_scheduletable`
--
ALTER TABLE `contract_scheduletable`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customer_code` (`customer_code`);

--
-- Indexes for table `customerservicedata`
--
ALTER TABLE `customerservicedata`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_id` (`employee_id`) USING BTREE;

--
-- Indexes for table `employeeteam`
--
ALTER TABLE `employeeteam`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `generalformoptions`
--
ALTER TABLE `generalformoptions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leadsource`
--
ALTER TABLE `leadsource`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `provinces`
--
ALTER TABLE `provinces`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rbacprofile`
--
ALTER TABLE `rbacprofile`
  ADD PRIMARY KEY (`rbacId`);

--
-- Indexes for table `regions`
--
ALTER TABLE `regions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `remarks_log`
--
ALTER TABLE `remarks_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `serviceoffer`
--
ALTER TABLE `serviceoffer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_code` (`customer_code`),
  ADD KEY `address_id` (`address_id`),
  ADD KEY `contract_id` (`contract_id`);

--
-- Indexes for table `service_area`
--
ALTER TABLE `service_area`
  ADD PRIMARY KEY (`area_id`);

--
-- Indexes for table `service_contract`
--
ALTER TABLE `service_contract`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_contract_files`
--
ALTER TABLE `service_contract_files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_contract_remarks`
--
ALTER TABLE `service_contract_remarks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_initialvisit`
--
ALTER TABLE `service_initialvisit`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_initialvisit_attachment`
--
ALTER TABLE `service_initialvisit_attachment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_proposal`
--
ALTER TABLE `service_proposal`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_proposal_files`
--
ALTER TABLE `service_proposal_files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_schedule`
--
ALTER TABLE `service_schedule`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_schedule_remarks`
--
ALTER TABLE `service_schedule_remarks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_treatment_scenario`
--
ALTER TABLE `service_treatment_scenario`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_treatment_scenario_fields`
--
ALTER TABLE `service_treatment_scenario_fields`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `treatment_schedule`
--
ALTER TABLE `treatment_schedule`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `customer_code` (`customer_code`),
  ADD KEY `address_id` (`address_id`),
  ADD KEY `contract_id` (`contract_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `addresschoices`
--
ALTER TABLE `addresschoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `adonis_schema`
--
ALTER TABLE `adonis_schema`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `area_of_responsibility`
--
ALTER TABLE `area_of_responsibility`
  MODIFY `aor_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `barangays`
--
ALTER TABLE `barangays`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contracts`
--
ALTER TABLE `contracts`
  MODIFY `contract_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contract_scheduletable`
--
ALTER TABLE `contract_scheduletable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customerservicedata`
--
ALTER TABLE `customerservicedata`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employeeteam`
--
ALTER TABLE `employeeteam`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `generalformoptions`
--
ALTER TABLE `generalformoptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leadsource`
--
ALTER TABLE `leadsource`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rbacprofile`
--
ALTER TABLE `rbacprofile`
  MODIFY `rbacId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `regions`
--
ALTER TABLE `regions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `remarks_log`
--
ALTER TABLE `remarks_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `serviceoffer`
--
ALTER TABLE `serviceoffer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_area`
--
ALTER TABLE `service_area`
  MODIFY `area_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_contract`
--
ALTER TABLE `service_contract`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_contract_files`
--
ALTER TABLE `service_contract_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_contract_remarks`
--
ALTER TABLE `service_contract_remarks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_initialvisit`
--
ALTER TABLE `service_initialvisit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_initialvisit_attachment`
--
ALTER TABLE `service_initialvisit_attachment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_proposal`
--
ALTER TABLE `service_proposal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_proposal_files`
--
ALTER TABLE `service_proposal_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_schedule`
--
ALTER TABLE `service_schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_schedule_remarks`
--
ALTER TABLE `service_schedule_remarks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_treatment_scenario`
--
ALTER TABLE `service_treatment_scenario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_treatment_scenario_fields`
--
ALTER TABLE `service_treatment_scenario_fields`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
