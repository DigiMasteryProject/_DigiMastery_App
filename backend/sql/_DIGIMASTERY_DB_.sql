-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 15-05-2026 a las 18:20:48
-- Versión del servidor: 8.0.43
-- Versión de PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `digimastery`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Campaign`
--

CREATE TABLE `Campaign` (
  `id` int NOT NULL,
  `name` varchar(30) NOT NULL,
  `next_session` datetime DEFAULT NULL,
  `map` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `observations` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `Campaign`
--

INSERT INTO `Campaign` (`id`, `name`, `next_session`, `map`, `observations`) VALUES
(1, 'Campaña Predefinida', NULL, NULL, NULL),
(2, 'Digital Breakers', '2026-05-23 00:00:00', '', 'Probando, probando, mese escucha?'),
(17, '', '2026-05-14 00:00:00', NULL, NULL),
(18, 'Prueba 1', NULL, NULL, NULL),
(30, 'A', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `CodeShard`
--

CREATE TABLE `CodeShard` (
  `id_shard` int NOT NULL,
  `id_uc` int NOT NULL,
  `slot_1` int NOT NULL,
  `slot_2` int NOT NULL,
  `slot_3` int NOT NULL,
  `slot_4` int NOT NULL,
  `slot_5` int NOT NULL,
  `slot_6` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `CodeShard`
--

INSERT INTO `CodeShard` (`id_shard`, `id_uc`, `slot_1`, `slot_2`, `slot_3`, `slot_4`, `slot_5`, `slot_6`) VALUES
(1, 1, 2, 3, 4, 1, 3, 4),
(5, 1, 8, 7, 5, 9, 5, 4),
(7, 1, 6, 9, 4, 4, 9, 7),
(10, 11, 6, 1, 1, 8, 1, 3),
(11, 1, 3, 1, 1, 1, 3, 9),
(12, 11, 2, 7, 4, 1, 8, 2),
(16, 11, 1, 7, 5, 8, 6, 1),
(19, 11, 4, 4, 1, 8, 9, 6),
(20, 1, 7, 9, 2, 9, 3, 8),
(21, 11, 6, 5, 9, 6, 7, 1),
(23, 25, 5, 8, 6, 1, 7, 4),
(25, 25, 3, 2, 4, 9, 6, 7),
(26, 25, 3, 5, 8, 9, 8, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Digimon`
--

CREATE TABLE `Digimon` (
  `id` int NOT NULL,
  `name` varchar(40) NOT NULL,
  `family_tree` int NOT NULL,
  `attribute` varchar(20) DEFAULT NULL,
  `element` varchar(20) DEFAULT NULL,
  `growth_phase` varchar(20) NOT NULL,
  `health_points` int NOT NULL,
  `skill_points` int NOT NULL,
  `attack` int NOT NULL,
  `defense` int NOT NULL,
  `spirit` int NOT NULL,
  `speed` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `Digimon`
--

INSERT INTO `Digimon` (`id`, `name`, `family_tree`, `attribute`, `element`, `growth_phase`, `health_points`, `skill_points`, `attack`, `defense`, `spirit`, `speed`) VALUES
(1, 'Botamon', 2, 'Archivo', 'Neutro', 'Fresh', 80, 30, 15, 10, 10, 15),
(2, 'Kuramon', 7, 'Archivo', 'Neutro', 'Fresh', 80, 30, 15, 13, 7, 10),
(3, 'Poyomon', 4, 'Archivo', 'Neutro', 'Fresh', 80, 30, 10, 10, 15, 10),
(4, 'Punimon', 1, 'Archivo', 'Neutro', 'Fresh', 80, 30, 15, 7, 13, 10),
(5, 'Black Chibimon', 2, 'Archivo', 'Neutro', 'In Training', 100, 50, 30, 15, 25, 20),
(6, 'Bukamon', 4, 'Archivo', 'Agua', 'In Training', 95, 55, 20, 20, 30, 20),
(7, 'Chibimon', 2, 'Archivo', 'Neutro', 'In Training', 110, 40, 25, 20, 25, 20),
(8, 'Koromon', 2, 'Archivo', 'Fuego', 'In Training', 105, 45, 25, 17, 25, 23),
(9, 'Minomon', 6, 'Archivo', 'Planta', 'In Training', 90, 60, 20, 40, 20, 10),
(10, 'Motimon', 6, 'Archivo', 'Planta', 'In Training', 95, 55, 25, 25, 25, 15),
(11, 'Nyaromon', 8, 'Archivo', 'Luz', 'In Training', 100, 50, 15, 20, 30, 25),
(12, 'Pagumon', 7, 'Archivo', 'Oscuridad', 'In Training', 95, 55, 25, 15, 25, 25),
(13, 'Tanemon', 6, 'Archivo', 'Planta', 'In Training', 90, 60, 15, 30, 30, 15),
(14, 'Tokomon', 5, 'Archivo', 'Aire', 'In Training', 95, 55, 20, 20, 20, 30),
(15, 'Tsumemon', 7, 'Archivo', 'Oscuridad', 'In Training', 85, 65, 25, 20, 25, 20),
(16, 'Tsunomon', 1, 'Archivo', 'Tierra', 'In Training', 100, 50, 25, 25, 20, 20),
(17, 'Wanyamon', 1, 'Archivo', 'Aire', 'In Training', 105, 45, 30, 20, 20, 20),
(18, 'Agumon', 2, 'Vacuna', 'Fuego', 'Rookie', 120, 80, 35, 30, 35, 30),
(19, 'Armadimon', 1, 'Archivo', 'Tierra', 'Rookie', 120, 60, 30, 50, 30, 20),
(20, 'Bearmon', 1, 'Vacuna', 'Tierra', 'Rookie', 110, 70, 35, 35, 35, 25),
(21, 'Betamon', 4, 'Virus', 'Electricidad', 'Rookie', 100, 80, 25, 40, 40, 25),
(22, 'Black Agumon', 2, 'Virus', 'Fuego', 'Rookie', 120, 80, 35, 30, 35, 30),
(23, 'Black Gabumon', 1, 'Virus', 'Tierra', 'Rookie', 125, 75, 35, 35, 35, 25),
(24, 'Black Guilmon', 2, 'Virus', 'Fuego', 'Rookie', 120, 60, 30, 30, 40, 30),
(25, 'Black Veemon', 2, 'Archivo', 'Neutro', 'Rookie', 110, 70, 35, 30, 40, 25),
(26, 'Chuumon', 1, 'Virus', 'Tierra', 'Rookie', 90, 90, 25, 25, 25, 55),
(27, 'Demi Devimon', 7, 'Virus', 'Oscuridad', 'Rookie', 70, 110, 30, 20, 50, 30),
(28, 'DORUmon', 2, 'Dato', 'Neutro', 'Rookie', 80, 100, 35, 30, 35, 30),
(29, 'Dracmon', 7, 'Virus', 'Oscuridad', 'Rookie', 75, 105, 40, 20, 40, 30),
(30, 'Dracomon', 2, 'Dato', 'Fuego', 'Rookie', 90, 90, 35, 30, 40, 25),
(31, 'Falcomon', 5, 'Vacuna', 'Aire', 'Rookie', 85, 95, 35, 20, 35, 40),
(32, 'FunBeemon', 6, 'Virus', 'Planta', 'Rookie', 100, 80, 25, 40, 25, 40),
(33, 'Gabumon', 1, 'Dato', 'Fuego', 'Rookie', 95, 85, 40, 35, 40, 25),
(34, 'Gaomon', 1, 'Dato', 'Aire', 'Rookie', 85, 95, 40, 25, 30, 35),
(35, 'Gazimon', 1, 'Virus', 'Oscuridad', 'Rookie', 100, 80, 45, 25, 30, 30),
(36, 'Goburimon', 1, 'Virus', 'Tierra', 'Rookie', 95, 85, 45, 30, 25, 30),
(37, 'Gomamon', 4, 'Vacuna', 'Agua', 'Rookie', 90, 90, 25, 40, 40, 25),
(38, 'Gotsumon', 3, 'Dato', 'Tierra', 'Rookie', 105, 75, 45, 45, 20, 20),
(39, 'Guilmon', 2, 'Virus', 'Fuego', 'Rookie', 95, 85, 35, 30, 35, 30),
(40, 'Hagurumon', 3, 'Virus', 'Eléctrico', 'Rookie', 100, 80, 25, 45, 30, 30),
(41, 'Hawkmon', 5, 'Archivo', 'Aire', 'Rookie', 85, 95, 35, 25, 30, 40),
(42, 'Huckmon', 3, 'Dato', 'Fuego', 'Rookie', 75, 105, 35, 25, 35, 35),
(43, 'Impmon', 7, 'Virus', 'Oscuridad', 'Rookie', 70, 110, 35, 25, 40, 30),
(44, 'Kamemon', 4, 'Dato', 'Agua', 'Rookie', 100, 80, 30, 45, 35, 20),
(45, 'Keramon', 7, 'Virus', 'Oscuridad', 'Rookie', 75, 105, 35, 25, 40, 30),
(46, 'Lalamon', 6, 'Dato', 'Planta', 'Rookie', 90, 90, 25, 30, 40, 30),
(47, 'Lopmon', 1, 'Dato', 'Luz', 'Rookie', 95, 85, 30, 30, 40, 30),
(48, 'Lucemon', 8, 'Vacuna', 'Luz', 'Rookie', 110, 90, 40, 35, 45, 35),
(49, 'Lunamon', 4, 'Dato', 'Agua', 'Rookie', 90, 90, 30, 30, 40, 30),
(50, 'Monodramon', 2, 'Vacuna', 'Aire', 'Rookie', 95, 85, 40, 30, 30, 35),
(51, 'Otamamon', 4, 'Virus', 'Agua', 'Rookie', 85, 95, 25, 30, 40, 30),
(52, 'Palmon', 6, 'Dato', 'Planta', 'Rookie', 95, 85, 30, 35, 40, 25),
(53, 'Patamon', 5, 'Dato', 'Aire', 'Rookie', 90, 90, 25, 25, 40, 35),
(54, 'Plotmon', 8, 'Vacuna', 'Luz', 'Rookie', 95, 85, 30, 30, 40, 30),
(55, 'Renamon', 1, 'Dato', 'Planta', 'Rookie', 85, 95, 35, 25, 40, 35),
(56, 'Ryudamon', 2, 'Vacuna', 'Fuego', 'Rookie', 100, 80, 40, 35, 30, 30),
(57, 'Shoutmon', 2, 'Dato', 'Fuego', 'Rookie', 95, 85, 35, 30, 35, 35),
(58, 'Sistermon Blanc', 8, 'Vacuna', 'Luz', 'Rookie', 90, 90, 30, 30, 40, 30),
(59, 'Solarmon', 3, 'Vacuna', 'Fuego', 'Rookie', 100, 80, 35, 40, 30, 25),
(60, 'Syakomon', 4, 'Virus', 'Agua', 'Rookie', 90, 90, 30, 35, 35, 30),
(61, 'Tentomon', 6, 'Vacuna', 'Electricidad', 'Rookie', 95, 85, 30, 35, 35, 35),
(62, 'Terriermon', 1, 'Vacuna', 'Aire', 'Rookie', 90, 90, 35, 30, 35, 35),
(63, 'Toy Agumon', 3, 'Vacuna', 'Fuego', 'Rookie', 105, 75, 35, 35, 30, 30),
(64, 'Veemon', 2, 'Vacuna', 'Neutro', 'Rookie', 100, 80, 40, 30, 35, 35),
(65, 'Wormmon', 6, 'Virus', 'Planta', 'Rookie', 90, 90, 30, 35, 35, 30),
(66, 'Yuki Gorubimon', 1, 'Dato', 'Tierra', 'Rookie', 105, 75, 40, 35, 25, 25),
(67, 'Zubamon', 3, 'Vacuna', 'Metal', 'Rookie', 100, 80, 35, 40, 30, 30),
(68, 'Kudamon', 8, 'Vacuna', 'Luz', 'Rookie', 80, 100, 25, 30, 45, 30);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `DigimonEvolution`
--

CREATE TABLE `DigimonEvolution` (
  `id_evo` bigint UNSIGNED NOT NULL,
  `base_digimon_id` int NOT NULL,
  `new_digimon_id` int NOT NULL,
  `evo_condition` varchar(255) DEFAULT NULL,
  `slot` smallint DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `DigimonEvolution`
--

INSERT INTO `DigimonEvolution` (`id_evo`, `base_digimon_id`, `new_digimon_id`, `evo_condition`, `slot`) VALUES
(1, 1, 8, 'Lv. 6 | Friendship 10%', 1),
(2, 1, 17, 'Lv. 6 | Friendship 15%', 2),
(3, 2, 5, 'Lv. 5 | Friendship 15%', 1),
(4, 2, 12, 'Lv. 6 | Friendship 10%', 2),
(5, 2, 15, 'Lv. 6 | Friendship 10%', 3),
(6, 3, 6, 'Lv. 6 | Friendship 10%', 1),
(7, 3, 9, 'Lv. 5 | Friendship 10%', 2),
(8, 3, 10, 'Lv. 5 | Friendship 10%', 3),
(9, 3, 13, 'Lv. 5 | Friendship 10%', 4),
(10, 3, 14, 'Lv. 5 | Friendship 15%', 5),
(11, 4, 7, 'Lv. 5 | Friendship 10%', 1),
(12, 4, 11, 'Lv. 5 | Friendship 10%', 2),
(15, 4, 16, 'Lv. 6 | Friendship 10%', 3),
(16, 5, 25, 'Lv. 10 | Friendship 25%', 1),
(17, 6, 21, 'Lv. 10 | Friendship 20%', 1),
(18, 6, 37, 'LV. 12 | Friendship 30%', 2),
(19, 6, 44, 'Lv. 10 | Friendship 15%', 3),
(20, 6, 51, 'Lv. 8 | Friendship 10%', 4),
(21, 6, 60, 'Lv. 9 | Friendship 10%', 5),
(22, 6, 66, 'Lv. 11 | Friendship 10%', 6),
(23, 7, 64, 'Lv. 10 | Friendship 25%', 1),
(24, 8, 18, 'Lv. 12 | Friendship 25%', 1),
(25, 8, 30, 'Lv. 9 | Friendship 20%', 2),
(26, 8, 39, 'Lv. 12 | Friendship 30%', 3),
(27, 8, 42, 'Lv. 12 | Friendship 35%', 4),
(28, 8, 57, 'Lv. 11 | Friendship 20%', 5),
(29, 8, 63, 'Lv. 10 | Friendship 15%', 6),
(30, 9, 65, 'Lv. 10 | Friendship 20%', 1),
(31, 10, 38, 'Lv. 9 | Friendship 15%', 1),
(32, 10, 59, 'Lv. 10 | Friendship 20%', 2),
(33, 10, 61, 'Lv. 11 | Friendship 20%', 3),
(34, 11, 19, 'Lv. 11 | Friendship 20%', 1),
(35, 11, 49, 'Lv. 11 | Friendship 20%', 2),
(36, 11, 54, 'Lv. 11 | Friendship 20%', 3),
(37, 11, 62, 'Lv. 11 | Friendship 25%', 4),
(38, 12, 26, 'Lv. 9 | Friendship 20%', 1),
(39, 12, 35, 'Lv. 10 | Friendship 10%', 2),
(40, 12, 43, 'Lv. 10 | Friendship 15%', 3),
(41, 12, 47, 'Lv. 11 | Friendship 25%', 4),
(42, 13, 32, 'Lv. 9 | Friendship 20%', 1),
(43, 13, 46, 'Lv. 11 | Friendship 20%', 2),
(44, 13, 52, 'Lv. 11 | Friendship 25%', 3),
(45, 13, 55, 'Lv. 10 | Friendship 25%', 4),
(46, 14, 31, 'Lv. 11 | Friendship 20%', 1),
(47, 14, 41, 'Lv. 11 | Friendship 30%', 2),
(48, 14, 48, 'This is a special digimon. Evolution might require a strong bond between party and their digimon...', 3),
(49, 14, 53, 'Lv. 11 | Friendship 20%', 4),
(50, 14, 58, 'Lv. 15 | Friendship 40% | Spirit > 80', 5),
(51, 15, 22, 'Lv. 12 | Friendship 25%', 1),
(52, 15, 24, 'Lv. 13 | Friendship 20%', 2),
(53, 15, 27, 'Lv. 10 | Friendship 10%', 3),
(54, 15, 29, 'Lv. 9 | Friendship 10%', 4),
(55, 15, 45, 'Lv. 12 | Friendship 10%', 5),
(56, 16, 23, 'Lv. 12 | Friendship 25%', 1),
(57, 16, 33, 'Lv. 12 | Friendship 25%', 2),
(58, 16, 36, 'Lv. 11 | Friendship 10%', 3),
(59, 16, 40, 'Lv. 10 | Friendship 20%', 4),
(60, 16, 50, 'Lv. 9 | Friendship 15%', 5),
(61, 16, 67, 'Lv. 12 | Friendship 20% | 10 Machine Digimon defeated', 6),
(62, 17, 20, 'Lv. 12 | Friendship 20%', 1),
(63, 17, 28, 'Lv. 11 | Friendship 30%', 2),
(64, 17, 34, 'Lv. 12 | Friendship 25%', 3),
(65, 17, 68, 'Lv. 11 | Friendship 20%', 4),
(66, 17, 56, 'Lv. 10 | Friendship 15%', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Digimon_Skill`
--

CREATE TABLE `Digimon_Skill` (
  `id_digimon` int NOT NULL,
  `id_skill` int NOT NULL,
  `learning` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `Digimon_Skill`
--

INSERT INTO `Digimon_Skill` (`id_digimon`, `id_skill`, `learning`) VALUES
(1, 1, 'Own'),
(1, 2, 'Own'),
(2, 3, 'Own'),
(2, 4, 'Own'),
(3, 1, 'Own'),
(3, 5, 'Own'),
(4, 1, 'Own'),
(4, 6, 'Own'),
(5, 1, 'Own'),
(5, 7, 'Own'),
(6, 1, 'Own'),
(6, 8, 'Own'),
(7, 1, 'Own'),
(7, 7, 'Own'),
(8, 2, 'Own'),
(8, 9, 'Own'),
(9, 1, 'Own'),
(9, 10, 'Own'),
(10, 1, 'Own'),
(10, 11, 'Own'),
(11, 12, 'Own'),
(11, 13, 'Own'),
(12, 1, 'Own'),
(12, 14, 'Own'),
(13, 1, 'Own'),
(13, 15, 'Own'),
(14, 1, 'Own'),
(14, 16, 'Own'),
(15, 1, 'Own'),
(15, 17, 'Own'),
(16, 1, 'Own'),
(16, 6, 'Own'),
(17, 1, 'Own'),
(17, 18, 'Own'),
(18, 19, 'Own'),
(18, 20, 'Own'),
(19, 21, 'Own'),
(19, 22, 'Own'),
(20, 23, 'Own'),
(21, 24, 'Own'),
(21, 25, 'Own'),
(22, 26, 'Own'),
(22, 27, 'Own'),
(23, 28, 'Own'),
(23, 29, 'Own'),
(24, 30, 'Own'),
(24, 31, 'Own'),
(25, 32, 'Own'),
(25, 33, 'Own'),
(26, 34, 'Own'),
(26, 35, 'Own'),
(27, 36, 'Own'),
(27, 37, 'Own'),
(28, 38, 'Own'),
(28, 39, 'Own'),
(29, 40, 'Own'),
(29, 41, 'Own'),
(30, 19, 'Own'),
(30, 43, 'Own'),
(31, 44, 'Own'),
(31, 45, 'Own'),
(32, 46, 'Own'),
(32, 47, 'Own'),
(33, 28, 'Own'),
(33, 29, 'Own'),
(34, 50, 'Own'),
(34, 51, 'Own'),
(35, 52, 'Own'),
(35, 53, 'Own'),
(36, 54, 'Own'),
(36, 55, 'Own'),
(37, 56, 'Own'),
(37, 57, 'Own'),
(38, 58, 'Own'),
(38, 59, 'Own'),
(39, 30, 'Own'),
(39, 61, 'Own'),
(40, 62, 'Own'),
(40, 63, 'Own'),
(41, 64, 'Own'),
(41, 65, 'Own'),
(42, 19, 'Own'),
(42, 67, 'Own'),
(43, 68, 'Own'),
(43, 69, 'Own'),
(44, 25, 'Own'),
(44, 70, 'Own'),
(45, 72, 'Own'),
(45, 73, 'Own'),
(46, 76, 'Own'),
(46, 77, 'Own'),
(47, 78, 'Own'),
(47, 79, 'Own'),
(48, 80, 'Own'),
(48, 81, 'Own'),
(49, 82, 'Own'),
(49, 83, 'Own'),
(50, 84, 'Own'),
(50, 85, 'Own'),
(51, 86, 'Own'),
(51, 87, 'Own'),
(52, 88, 'Own'),
(52, 89, 'Own'),
(53, 90, 'Own'),
(53, 91, 'Own'),
(54, 92, 'Own'),
(54, 93, 'Own'),
(55, 94, 'Own'),
(55, 95, 'Own'),
(56, 96, 'Own'),
(56, 97, 'Own'),
(57, 98, 'Own'),
(57, 99, 'Own'),
(58, 100, 'Own'),
(58, 101, 'Own'),
(59, 102, 'Own'),
(59, 103, 'Own'),
(60, 104, 'Own'),
(60, 105, 'Own'),
(61, 106, 'Own'),
(61, 107, 'Own'),
(62, 108, 'Own'),
(62, 109, 'Own'),
(63, 110, 'Own'),
(63, 111, 'Own'),
(64, 112, 'Own'),
(64, 113, 'Own'),
(65, 114, 'Own'),
(65, 115, 'Own'),
(66, 116, 'Own'),
(66, 117, 'Own'),
(67, 118, 'Own'),
(67, 119, 'Own'),
(68, 74, 'Own'),
(68, 75, 'Own');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Family`
--

CREATE TABLE `Family` (
  `id` int NOT NULL,
  `name` varchar(20) NOT NULL,
  `atk_given_ev` int NOT NULL,
  `def_given_ev` int NOT NULL,
  `spirit_given_ev` int NOT NULL,
  `speed_given_ev` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `Family`
--

INSERT INTO `Family` (`id`, `name`, `atk_given_ev`, `def_given_ev`, `spirit_given_ev`, `speed_given_ev`) VALUES
(1, 'Bestia', 1, 0, 0, 0),
(2, 'Dragón', 0, 0, 1, 0),
(3, 'Máquina', 0, 1, 0, 0),
(4, 'Acuático', 0, 0, 0, 1),
(5, 'Ave', 0, 0, 0, 1),
(6, 'Insecto', 0, 1, 0, 0),
(7, 'Oscuro', 1, 0, 0, 0),
(8, 'Sagrado', 0, 0, 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Human`
--

CREATE TABLE `Human` (
  `id` int NOT NULL,
  `name` varchar(40) NOT NULL,
  `courage` int NOT NULL,
  `intelligence` int NOT NULL,
  `serenity` int NOT NULL,
  `strength` int NOT NULL,
  `perception` int NOT NULL,
  `skill` int NOT NULL,
  `archetype` varchar(20) NOT NULL,
  `emblem` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `darkness` int NOT NULL,
  `id_user` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `Human`
--

INSERT INTO `Human` (`id`, `name`, `courage`, `intelligence`, `serenity`, `strength`, `perception`, `skill`, `archetype`, `emblem`, `darkness`, `id_user`) VALUES
(1, 'Hikari', 10, 10, 6, 10, 10, 10, 'Natural Leader', 'Courage', 10, 1),
(2, 'Yamato', 20, 10, 10, 20, 10, 15, 'Fighter', NULL, 50, 1),
(3, 'Ken', 10, 12, 5, 5, 8, 10, 'engineer', NULL, 50, NULL),
(7, 'New Human', 1, 1, 1, 1, 1, 1, '-', NULL, 0, 7),
(8, 'PedroPedroPedro Pedro', 5, 5, 5, 5, 4, 5, 'Natural Leader', 'Knowledge', 5, 7),
(9, 'Berthold', 1, 1, 1, 1, 1, 1, '-', NULL, 0, NULL),
(10, 'Tatsuya', 12, 4, 1, 5, 1, 1, 'Fighter', NULL, 20, NULL),
(11, 'Amaru', 1, 1, 1, 1, 1, 1, '-', NULL, 1, 11),
(12, 'New Human', 10, 1, 10, 1, 1, 1, 'Strategist', NULL, 0, 1),
(13, 'NPC prueba 5', 10, 10, 10, 10, 10, 9, 'Natural Leader', NULL, 0, 1),
(14, 'Prueba Arquetipos', 10, 1, 5, 10, 1, 5, 'Explorer', NULL, 0, 1),
(15, 'NPC prueba arquetipo', 11, 10, 13, 10, 12, 8, 'Instructor', NULL, 0, 1),
(16, 'A', 10, 5, 5, 5, 10, 5, 'Hunter', NULL, 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `NPC`
--

CREATE TABLE `NPC` (
  `id` int NOT NULL,
  `id_campaign` int NOT NULL,
  `id_human` int DEFAULT NULL,
  `id_digimon` int DEFAULT NULL,
  `type` enum('human','digimon') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `NPC`
--

INSERT INTO `NPC` (`id`, `id_campaign`, `id_human`, `id_digimon`, `type`) VALUES
(6, 1, NULL, 8, 'digimon'),
(7, 1, 3, NULL, 'human'),
(9, 2, NULL, 9, 'digimon'),
(10, 1, NULL, 10, 'digimon'),
(11, 1, NULL, 11, 'digimon'),
(12, 1, 9, NULL, 'human'),
(13, 1, 10, NULL, 'human'),
(14, 2, 13, NULL, 'human'),
(15, 2, 15, NULL, 'human');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `OtherDigimon`
--

CREATE TABLE `OtherDigimon` (
  `id` int NOT NULL,
  `id_digimon` int NOT NULL,
  `level` int NOT NULL,
  `atk_ev` int NOT NULL,
  `def_ev` int NOT NULL,
  `spirit_ev` int NOT NULL,
  `speed_ev` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `OtherDigimon`
--

INSERT INTO `OtherDigimon` (`id`, `id_digimon`, `level`, `atk_ev`, `def_ev`, `spirit_ev`, `speed_ev`) VALUES
(1, 7, 10, 0, 0, 10, 1),
(2, 58, 30, 15, 30, 30, 15),
(7, 19, 10, 5, 5, 5, 5),
(8, 19, 11, 10, 5, 5, 5),
(9, 2, 10, 3, 0, 0, 0),
(10, 1, 1, 0, 0, 0, 0),
(11, 12, 12, 5, 0, 0, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `PartnerDigimon`
--

CREATE TABLE `PartnerDigimon` (
  `id` int NOT NULL,
  `id_digimon` int NOT NULL,
  `nickname` varchar(20) DEFAULT NULL,
  `level` int NOT NULL,
  `atk_ev` int NOT NULL,
  `def_ev` int NOT NULL,
  `spirit_ev` int NOT NULL,
  `spe_ev` int NOT NULL,
  `friendship` int NOT NULL,
  `id_user` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `PartnerDigimon`
--

INSERT INTO `PartnerDigimon` (`id`, `id_digimon`, `nickname`, `level`, `atk_ev`, `def_ev`, `spirit_ev`, `spe_ev`, `friendship`, `id_user`) VALUES
(1, 64, 'Veevee', 20, 1, 1, 1, 1, 15, 1),
(2, 61, 'Shocker', 1, 0, 0, 0, 0, 0, 1),
(4, 1, 'Mike', 1, 0, 0, 0, 0, 0, 7),
(5, 67, '', 1, 0, 0, 0, 0, 0, 7),
(6, 64, 'Yaax', 1, 1, 1, 1, 1, 1, 11),
(7, 9, 'Alm', 1, 0, 0, 0, 0, 0, 1),
(8, 25, 'Eeveev', 1, 0, 0, 0, 0, 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Reward`
--

CREATE TABLE `Reward` (
  `id` int NOT NULL,
  `slot_1` int NOT NULL,
  `slot_2` int NOT NULL,
  `slot_3` int NOT NULL,
  `slot_4` int NOT NULL,
  `slot_5` int NOT NULL,
  `slot_6` int NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `Reward`
--

INSERT INTO `Reward` (`id`, `slot_1`, `slot_2`, `slot_3`, `slot_4`, `slot_5`, `slot_6`, `name`) VALUES
(1, 6, 0, 4, 6, 3, 1, 'Courage digimental'),
(2, 4, 1, 5, 1, 7, 2, 'Friendship digimental'),
(3, 1, 0, 4, 4, 3, 9, 'Love digimental'),
(4, 5, 1, 7, 0, 3, 8, 'Sincerity digimental'),
(5, 8, 0, 2, 1, 3, 6, 'Knowledge digimental'),
(6, 0, 9, 1, 7, 2, 6, 'Purity digimental'),
(7, 8, 0, 0, 4, 3, 5, 'Hope digimental'),
(8, 1, 1, 8, 7, 0, 9, 'Light digimental'),
(9, 4, 1, 6, 7, 3, 5, 'Kindness digimental'),
(10, 2, 1, 5, 4, 9, 0, 'Miracles digimental'),
(11, 8, 3, 5, 7, 1, 4, 'Destiny digimental'),
(12, 3, 0, 9, 7, 3, 1, 'Frustration digimental');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Session`
--

CREATE TABLE `Session` (
  `id` int NOT NULL,
  `id_campaign` int NOT NULL,
  `observation` varchar(255) DEFAULT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `Session`
--

INSERT INTO `Session` (`id`, `id_campaign`, `observation`, `date`) VALUES
(1, 2, 'Pues se observa', '2026-05-30'),
(2, 18, '', '2026-05-07'),
(3, 30, '', '2026-05-16'),
(4, 17, '', '2026-05-23'),
(5, 17, '', '2026-05-14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Skill`
--

CREATE TABLE `Skill` (
  `id_skill` int NOT NULL,
  `name` varchar(20) NOT NULL,
  `type` enum('Damage','Support','Debuff') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `element` varchar(20) NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `MP_Cost` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `Skill`
--

INSERT INTO `Skill` (`id_skill`, `name`, `type`, `element`, `description`, `MP_Cost`) VALUES
(1, 'Bubble', 'Damage', 'Water', 'Blows bubbles to attack the enemy', 10),
(2, 'Acid Bubble F', 'Damage', 'Fire', 'Blows bubbles made of acid to harm the enemy', 15),
(3, 'Darkness Tears', 'Damage', 'Dark', 'Shoots tears made of dark energy against the oponent.', 15),
(4, 'Dizziness', 'Debuff', 'Neutral', 'Makes the opponent dizzy so it gets confused (4 on a d4 to procc the status).', 10),
(5, 'Acid Bubble W', 'Damage', 'Water', 'Blows bubbles made of acid to harm the enemy', 15),
(6, 'Acid Bubble E', 'Damage', 'Earth', 'Blows bubbles made of acid to harm the enemy', 15),
(7, 'Hop Attack', 'Damage', 'Neutral', 'Jumps on the target and stuns it (4 on a d4 to procc the effect).', 20),
(8, 'Air Bubble', 'Damage', 'Wind', 'Shots compressed air to the target.', 15),
(9, 'Soft Tackle', 'Damage', 'Neutral', 'Softly tackles the target with its body.', 15),
(10, 'Sticky Thread', 'Debuff', 'Neutral', 'Slows the target\'s movements, the affected digimon rolls on disadvantage.', 15),
(11, 'DigiJelly', 'Support', 'Neutral', 'Reduces next received damage to 25% of the original hit.', 20),
(12, 'Fox Tail', 'Damage', 'Neutral', 'Hits the target with its tail puffed.', 15),
(13, 'Dazzle', 'Debuff', 'Light', 'Shines and dazzles the target, with a chance to confuse it (4 on a d4 to procc the effect).', 15),
(14, 'Poison Bubbles', 'Damage', 'Dark', 'Spits poisonous bubbles to the target, with a chance to poison them (3 on a d3 to procc the effect).', 25),
(15, 'Adhesive Bubbles', 'Damage', 'Nature', 'Spits bubbles to the target which slow it down 25% of its total speed during 1d2 turns.', 20),
(16, 'Bite', 'Damage', 'Neutral', 'Bites the target with all its jaw. Has a chance to inmovilize it 1 turn (10 on a d10 to procc the effect).', 15),
(17, 'Scratch', 'Damage', 'Dark', 'Scratches the target with its claws surrounded on dark energy.', 15),
(18, 'Smile Fang', 'Damage', 'Wind', 'Feints the target with a cute smile, then bites it. Can inmovilize for 1 turn (10 on a d10 to procc the effect).', 15),
(19, 'Baby Flame', 'Damage', 'Fire', 'Deals fire damage (1d5). On max roll increases burn damage. The Digimon exhales a small flame burst.', 20),
(20, 'Fierce Bite', 'Damage', 'Fire', 'Deals fire damage (1d8). On max roll immobilizes the target. The Digimon bites down with corrupted fiery energy.', 15),
(21, 'Rolling Strike', 'Support', 'Earth', 'Reduces incoming damage by 10% for the duration of the action. The Digimon curls into a defensive spinning shell stance to absorb impact.', 15),
(22, 'Rolling Defense', 'Support', 'Earth', 'Reduces incoming damage for 1 turn. The Digimon withdraws into its armored shell, spinning defensively to mitigate attacks.', 20),
(23, 'Karate Punch', 'Damage', 'Earth', 'Deals earth elemental damage. The Digimon delivers a powerful martial arts-style punch infused with ground energy.', 20),
(24, 'Electroshock', 'Debuff', 'Lightning', 'Deals lightning damage with a chance to paralyze the target. The Digimon releases an electric discharge from its body toward the enemy.', 20),
(25, 'Water Jet', 'Damage', 'Water', 'Deals water elemental damage. The Digimon fires a pressurized stream of water from its mouth.', 15),
(26, 'Baby Flame', 'Damage', 'Fire', 'Deals fire damage (1d5). On max roll increases burn damage. The Digimon exhales a small flame burst.', 20),
(27, 'Fierce Bite', 'Damage', 'Fire', 'Deals fire damage (1d8). On max roll immobilizes the target. The Digimon bites down with corrupted fiery energy.', 15),
(28, 'Mini Flame', 'Damage', 'Fire', 'Deals fire damage (1d5). The Digimon releases a small flame burst from its fur.', 20),
(29, 'Horn Attack', 'Damage', 'Earth', 'Deals earth damage. The Digimon strikes forward using its horn as a blunt weapon.', 15),
(30, 'Fire Grenade', 'Damage', 'Fire', 'Deals fire damage (1d3). On max roll increases burn damage. The Digimon launches a compact explosive fire orb.', 20),
(31, 'Virus Breath', 'Debuff', 'Fire', 'Applies poison chance while dealing fire damage. The Digimon releases corrupted viral flames in a straight breath attack.', 20),
(32, 'Veemon Punch', 'Damage', 'Neutral', 'Deals neutral damage (1d8). On max roll applies stun. The Digimon strikes with a fast reinforced punch combo.', 20),
(33, 'Rigged Victory', 'Debuff', 'Neutral', 'Applies poison chance while dealing neutral damage. The Digimon performs a deceptive rapid strike sequence aimed at destabilizing the target.', 15),
(34, 'Escape', 'Support', 'Neutral', 'Allows escape from combat regardless of conditions. The Digimon quickly retreats using erratic movement patterns.', 30),
(35, 'Rancid Cheese', 'Debuff', 'Earth', 'Applies stun or poison chance. The Digimon throws contaminated food causing status disruption.', 25),
(36, 'Demi Darts', 'Damage', 'Dark', 'Deals dark damage and absorbs 10% of damage dealt as HP. The Digimon fires cursed darts that siphon energy from the target.', 40),
(37, 'Dark Whisper', 'Debuff', 'Dark', 'Applies sleep chance. The Digimon whispers corrupted thoughts that weaken the target’s consciousness.', 30),
(38, 'Metal Shot', 'Damage', 'Neutral', 'Deals neutral damage (1d8). On max roll applies stun. The Digimon fires metallic projectiles from its body mechanisms.', 30),
(39, 'Hyper Metal Speed', 'Damage', 'Neutral', 'Deals neutral damage (1d4). On max roll applies stun. The Digimon accelerates its metallic limbs for a high-speed strike.', 35),
(40, 'Rotten Fang', 'Debuff', 'Dark', 'Applies poison chance. The Digimon bites with corrupted fangs releasing necrotic toxins.', 35),
(41, 'Nightmare Eyes', 'Debuff', 'Dark', 'Applies sleep chance. The Digimon emits hypnotic eye waves that induce nightmares.', 35),
(42, 'Baby Flame', 'Damage', 'Fire', 'Deals fire damage (1d5). On max roll increases burn damage. The Digimon exhales a small flame burst.', 20),
(43, 'Tail Strike', 'Damage', 'Neutral', 'Deals neutral damage (1d8). The Digimon swings its tail with high-impact force.', 25),
(44, 'Air Blade', 'Damage', 'Wind', 'Deals wind damage (1d4). The Digimon slashes the air with its wing blades.', 30),
(45, 'Shadow Cloud', 'Support', 'Dark', 'Grants invisibility for 1d5 turns. The Digimon disperses into shadowy feathers and vanishes from sight.', 35),
(46, 'Stinger Rain', 'Support', 'Nature', 'Deals damage to enemies and heals allies. The Digimon releases a swarm of toxic and restorative spores.', 15),
(47, 'Emergency Call', 'Support', 'Neutral', 'Reveals position to allies. The Digimon emits a high-frequency signal wave.', 20),
(48, 'Mini Flame', 'Damage', 'Fire', 'Deals fire damage (1d5). The Digimon releases a small flame burst from its fur.', 20),
(49, 'Horn Attack', 'Damage', 'Earth', 'Deals earth damage. The Digimon strikes forward using its horn as a blunt weapon.', 15),
(50, 'Rolling Hook', 'Debuff', 'Wind', 'Deals wind damage (1d6). On max roll applies confusion. The Digimon performs a spinning hook strike.', 30),
(51, 'Savage Roar', 'Debuff', 'Wind', 'Deals wind damage (1d6). On max roll applies stun. The Digimon emits a powerful intimidating roar.', 30),
(52, 'Slash Claws', 'Damage', 'Neutral', 'Deals neutral damage (1d8). On max roll applies stun. The Digimon attacks with sharp claw slashes.', 20),
(53, 'Paralyzing Breath', 'Debuff', 'Dark', 'Applies paralysis/poison chance. The Digimon exhales corrupted toxic breath.', 25),
(54, 'Goblin Bomb', 'Damage', 'Fire', 'Deals fire damage (1d5). On max roll increases burn damage. The Digimon throws an explosive goblin-made bomb.', 15),
(55, 'Goblin Dash', 'Damage', 'Neutral', 'Deals neutral damage (1d8). On max roll applies stun. The Digimon charges forward in a reckless tackle.', 20),
(56, 'Sea March', 'Debuff', 'Water', 'Pushes target backward. The Digimon generates a current wave that sweeps the enemy away.', 20),
(57, 'Great Tide', 'Debuff', 'Water', 'Pushes target far backward. The Digimon releases a massive tidal surge.', 30),
(58, 'Earthquake Tremor', 'Debuff', 'Earth', 'Deals earth damage and pushes target backward. The Digimon triggers a ground rupture beneath the enemy.', 25),
(59, 'Rock Fist', 'Damage', 'Earth', 'Deals earth damage (1d8). On max roll applies stun. The Digimon punches with reinforced stone fists.', 10),
(60, 'Fire Grenade', 'Damage', 'Fire', 'Deals fire damage (1d3). On max roll increases burn damage. The Digimon launches a compact explosive fire orb.', 20),
(61, 'Guilmon Shot', 'Damage', 'Fire', 'Deals fire damage (1d2). On max roll increases burn damage. The Digimon releases a concentrated flame beam.', 30),
(62, 'Dark Gear', 'Debuff', 'Lightning', 'Multi-hit lightning attack (3d5). If any roll is 5, target becomes disabled. The Digimon fires rotating cursed gears infused with electricity.', 40),
(63, 'Electrifier', 'Damage', 'Lightning', 'Deals lightning damage (1d5). On max roll applies paralysis. The Digimon releases electrical discharge from its core.', 25),
(64, 'Feather Slash', 'Damage', 'Wind', 'Deals wind damage (1d8). On max roll applies stun. The Digimon slices the air with its talon wings.', 20),
(65, 'Hawk Dive', 'Debuff', 'Wind', 'Pushes target backward. The Digimon dives at high speed striking with its beak.', 30),
(66, 'Baby Flame', 'Damage', 'Fire', 'Deals fire damage (1d5). On max roll increases burn damage. The Digimon exhales a small flame burst.', 20),
(67, 'Drill Strike', 'Damage', 'Neutral', 'Deals neutral damage (1d8). On max roll applies stun. The Digimon strikes using a drilling claw attack.', 15),
(68, 'Magic Circle', 'Debuff', 'Dark', 'Impmon draws a dark magical sigil that distorts space around the enemy. Teleports enemy near ally and enables extra attack.', 30),
(69, 'Dark Flame', 'Damage', 'Fire', 'Impmon releases cursed violet flames from its hands. Deals damage (1d5). On max roll increases burn damage.', 25),
(70, 'Kame Fortress', 'Support', 'Neutral', 'Kamemon forms a reinforced defensive shell that protects allies. Reduces damage of next 3 ally hits by 20%.', 40),
(71, 'Water Shot', 'Damage', 'Water', 'Otamamon fires a pressurized water blast from its mouth. Deals water elemental damage.', 15),
(72, 'Corrupt Cannon', 'Debuff', 'Dark', 'Keramon fires unstable corrupted energy blasts that distort perception. Deals damage (1d6). On 5-6 applies confusion.', 25),
(73, 'Dark Destroyer', 'Damage', 'Dark', 'Keramon releases a concentrated sphere of dark matter energy. Deals damage (1d8). On max roll applies stun.', 20),
(74, 'Bullet Spiral', 'Damage', 'Neutral', 'Kudamon fires a spiral of energy bullets at high speed. Deals damage (1d8). On max roll applies stun.', 20),
(75, 'Blinding Ray', 'Debuff', 'Light', 'Kudamon emits a piercing light beam that disrupts vision. Deals damage (1d2). On roll 2 stuns and disables target.', 40),
(76, 'Forest Song', 'Debuff', 'Nature', 'Lalamon sings a mystical melody that affects the battlefield. On roll 2 applies sleep.', 30),
(77, 'Exploding Seeds', 'Debuff', 'Nature', 'Lalamon fires explosive seeds that detonate on impact. On roll 5 applies poison.', 30),
(78, 'Terrier Tornado', 'Damage', 'Wind', 'Lopmon generates a spiraling wind attack from its body. Deals damage (1d8). On max roll applies stun.', 30),
(79, 'Ice Flames', 'Damage', 'Water', 'Lopmon releases a hybrid icy flame burst. Deals damage (1d8). On max roll applies stun.', 35),
(80, 'Crucifixion', 'Damage', 'Light', 'Lucemon channels divine energy into a devastating holy strike. Deals damage (1d5). On max roll increases burn damage. Double vs Virus.', 60),
(81, 'Divine Punishment', 'Damage', 'Light', 'Lucemon releases a massive beam of judgment from above. Deals AoE damage on even roll.', 40),
(82, 'Lunar Claw', 'Damage', 'Dark', 'Lunamon strikes with crescent-shaped dark energy claws. Deals damage (1d8). On max roll applies stun.', 25),
(83, 'Tear Shot', 'Debuff', 'Water', 'Lunamon fires a tear-shaped energy projectile that weakens enemies. Deals damage (1d5). On max roll disables target.', 30),
(84, 'Knuckle Strike', 'Damage', 'Neutral', 'Monodramon delivers a powerful straight punch infused with raw strength. Deals damage (1d8). On max roll applies stun.', 15),
(85, 'Corrupted Bite', 'Debuff', 'Neutral', 'Monodramon bites the enemy with unstable energy corruption. Deals damage (1d2). On roll 2 applies bug.', 35),
(86, 'Sleep Bubbles', 'Debuff', 'Water', 'Otamamon releases floating bubbles filled with soporific toxins. On roll 3 applies sleep.', 30),
(87, 'Water Shot', 'Damage', 'Water', 'Otamamon fires a pressurized water blast from its mouth. Deals water elemental damage.', 25),
(88, 'Poison Ivy', 'Debuff', 'Nature', 'Deals nature damage (1d5). On max roll may cause paralysis. The Digimon extends vine whips infused with toxic energy and strikes the target from mid-range with controlled lash movements.', 25),
(89, 'Spores', 'Debuff', 'Nature', 'Inflicts sleep on the target. The Digimon releases a cloud of spores that slowly spreads through the battlefield before affecting the enemy’s nervous system.', 40),
(90, 'Air Shot', 'Damage', 'Wind', 'Deals wind elemental damage. The Digimon compresses air in its wings and fires it as high-speed projectiles toward the target.', 20),
(91, 'Thousand Wings', 'Damage', 'Wind', 'Deals wind damage (1d4). On max roll applies stun. The Digimon flaps its wings at high frequency creating a multi-hit aerodynamic barrage.', 30),
(92, 'Howl', 'Damage', 'Neutral', 'Deals damage (1d8). On max roll applies stun. The Digimon releases a resonant sonic howl that disrupts the enemy’s balance and focus.', 30),
(93, 'Divine Shot', 'Damage', 'Light', 'Deals light elemental damage. The Digimon concentrates divine energy and releases it as a straight holy beam from its mouth.', 30),
(94, 'Diamond Storm', 'Damage', 'Nature', 'Deals damage (1d8). On max roll applies stun. The Digimon generates a storm of energy-infused petals that strike the target from multiple angles.', 30),
(95, 'Energy Slash', 'Damage', 'Light', 'Deals damage (1d5). On max roll increases burn damage by 10%. The Digimon forms blades of light energy and performs a fast diagonal slash.', 30),
(96, 'Katana Strike', 'Damage', 'Neutral', 'Deals damage (1d8). On max roll applies stun. The Digimon executes a precise sword-like slash using its armored blade arm.', 25),
(97, 'Helmet Counter', 'Support', 'Neutral', 'Counters physical attacks with 150% damage. The Digimon enters a defensive stance inside its helmet armor and reflects incoming force.', 30),
(98, 'Soul Crusher', 'Damage', 'Fire', 'Deals damage (1d4). On max roll applies stun. The Digimon channels sound and flame energy into a concentrated explosive burst.', 30),
(99, 'Flame Hook', 'Damage', 'Fire', 'Deals damage (1d5). On max roll increases burn damage by 10%. The Digimon swings a flaming hook-shaped energy attack forward in a charged strike.', 25),
(100, 'Divine Piercer', 'Damage', 'Light', 'Deals light elemental damage. The Digimon fires a sacred piercing projectile condensed from holy energy.', 30),
(101, 'Protective Veil', 'Support', 'Light', 'Grants immunity to status effects for all allies. The Digimon creates a holy barrier that envelops the team in protective light.', 50),
(102, 'Solar Ring', 'Damage', 'Fire', 'Deals damage (1d5). On max roll increases burn damage by 10%. The Digimon releases a rotating ring of concentrated solar flame energy.', 30),
(103, 'Burn Blast', 'Damage', 'Fire', 'Deals massive damage (1d2). On lowest roll the user becomes weakened. The Digimon overloads its core and unleashes unstable solar fire.', 80),
(104, 'Black Pearl', 'Debuff', 'Water', 'Deals damage (1d2). On max roll pushes target backward. The Digimon fires a compressed pearl-like projectile with recoil force.', 15),
(105, 'Water Pressure', 'Debuff', 'Water', 'Deals damage (1d2). On max roll pushes target far backward. The Digimon releases a high-pressure water blast that drives the enemy away.', 30),
(106, 'Mini Ray', 'Damage', 'Lightning', 'Deals damage (1d6). On max roll applies paralysis. The Digimon fires a concentrated electrical beam from its horn.', 20),
(107, 'Dynamo Spin', 'Damage', 'Lightning', 'Deals damage (1d4). On max roll applies paralysis. The Digimon spins rapidly generating a surrounding electrical discharge field.', 30),
(108, 'Terrier Tornado', 'Damage', 'Wind', 'Deals damage (1d8). On max roll applies stun. The Digimon generates a spiraling tornado from its ears directed at the target.', 30),
(109, 'Burning Wind', 'Damage', 'Wind', 'Deals damage (1d5). On max roll increases burn damage by 10%. The Digimon releases heated wind pressure in a forward burst attack.', 35),
(110, 'Plastic Flame', 'Damage', 'Fire', 'Deals damage (1d8). On max roll applies stun. The Digimon fires a compressed synthetic flame burst with explosive impact.', 25),
(111, 'Baby Flame', 'Damage', 'Fire', 'Deals damage (1d5). On max roll increases burn damage by 10%. The Digimon releases small explosive fire bursts from its mouth.', 20),
(112, 'Veemon Punch', 'Damage', 'Neutral', 'Deals damage (1d8). On max roll applies stun. The Digimon performs a rapid close-range punching combo infused with energy.', 20),
(113, 'Spinning Fists', 'Debuff', 'Neutral', 'Deals damage and pushes target backward. The Digimon rotates its body while striking, generating centrifugal impact force.', 30),
(114, 'Sticky Web', 'Debuff', 'Nature', 'Prevents target movement for 1d3 turns. The Digimon releases sticky silk threads that immobilize the enemy on contact.', 30),
(115, 'Rolling Worm', 'Debuff', 'Neutral', 'Collision attack that knocks both units backward. The Digimon curls into a rolling form and crashes into the target.', 20),
(116, 'Goblin Bomb', 'Damage', 'Fire', 'Deals damage (1d5). On max roll increases burn damage by 10%. The Digimon throws an unstable explosive goblin-crafted fire bomb.', 15),
(117, 'Goblin Dash', 'Damage', 'Neutral', 'Deals damage (1d8). On max roll applies stun. The Digimon charges forward in a reckless explosive dash attack.', 20),
(118, '20 Degree Strike', 'Damage', 'Neutral', 'Deals damage (1d4). On max roll applies stun and knockback. The Digimon performs a precisely angled high-speed sword strike.', 30),
(119, '20 Blades', 'Damage', 'Neutral', 'Deals neutral blade damage. The Digimon unleashes a rapid dual-blade slash combo in multiple directions.', 20);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `User`
--

CREATE TABLE `User` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','USER') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `banned` tinyint(1) NOT NULL,
  `last_login` datetime DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `User`
--

INSERT INTO `User` (`id`, `username`, `email`, `password`, `role`, `banned`, `last_login`) VALUES
(1, 'LucGamer022', 'carlosrima2004@gmail.com', '$2b$10$RHbPq5msRbu/e4LormvBu.kMjg3dpaIz91l4Tgu.1yWJwo0cN58Qi', 'USER', 0, '2026-05-15 18:01:40'),
(2, 'Kib0u', 'abyago001@gmail.com', '$2b$10$EZkfvlZ7J3H4JokmCvuGoe.8CRqEE8X7XPPzhIcyd2ZXyGZPHaYzC', 'USER', 0, NULL),
(7, 'IsmaelKen', 'prueba1@gmail.com', '$2b$10$U4XR0kcqHPmVYMbK.Q1Fz.Tf2nstmiApT.epn68q3KYykdBsHX94K', 'USER', 0, '2026-05-15 16:13:12'),
(9, 'MnmnMrcflMd', 'rinmaycrls04@gmail.com', '$2b$10$XU7QIW2LWL3nTWhUkZMUeOn4hsqEfpGFRoisa75obOybVlYHkcoVS', 'ADMIN', 0, '2026-05-13 15:35:33'),
(11, 'Te amo uwu', 'beatrizbgalvez@gmail.com', '$2b$10$MCXAVO22dLI6nZuMM9MLJetnC9rSGw10HWiW3HwF9GyRzRpTKU4mG', 'USER', 0, '2026-05-09 09:48:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `User_Campaign`
--

CREATE TABLE `User_Campaign` (
  `id_uc` int NOT NULL,
  `id_user` int NOT NULL,
  `id_campaign` int NOT NULL,
  `human_sheet` int DEFAULT NULL,
  `partner_digimon` int DEFAULT NULL,
  `observations` varchar(255) DEFAULT NULL,
  `role` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `User_Campaign`
--

INSERT INTO `User_Campaign` (`id_uc`, `id_user`, `id_campaign`, `human_sheet`, `partner_digimon`, `observations`, `role`) VALUES
(1, 1, 2, 1, 1, 'Hola', 'DM'),
(4, 1, 17, NULL, NULL, NULL, 'DM'),
(5, 7, 18, NULL, NULL, NULL, 'DM'),
(11, 2, 2, NULL, NULL, 'Te regalo mi amol, te regalo mi vidah', 'Player'),
(25, 7, 2, 8, 4, NULL, 'Player'),
(26, 1, 30, NULL, NULL, NULL, 'DM'),
(29, 1, 18, 12, 7, 'Buenas', 'Player'),
(30, 11, 2, NULL, NULL, NULL, 'Player');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Campaign`
--
ALTER TABLE `Campaign`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `CodeShard`
--
ALTER TABLE `CodeShard`
  ADD PRIMARY KEY (`id_shard`),
  ADD KEY `cs_uc_fk` (`id_uc`);

--
-- Indices de la tabla `Digimon`
--
ALTER TABLE `Digimon`
  ADD PRIMARY KEY (`id`),
  ADD KEY `digimon_family_fk` (`family_tree`);

--
-- Indices de la tabla `DigimonEvolution`
--
ALTER TABLE `DigimonEvolution`
  ADD PRIMARY KEY (`id_evo`),
  ADD UNIQUE KEY `id_evo` (`id_evo`),
  ADD UNIQUE KEY `uq_evolution` (`base_digimon_id`,`new_digimon_id`),
  ADD UNIQUE KEY `uq_evo_slot` (`new_digimon_id`),
  ADD UNIQUE KEY `uq_origen_slot` (`base_digimon_id`,`slot`);

--
-- Indices de la tabla `Digimon_Skill`
--
ALTER TABLE `Digimon_Skill`
  ADD PRIMARY KEY (`id_digimon`,`id_skill`),
  ADD KEY `digimon_skill_fk` (`id_skill`);

--
-- Indices de la tabla `Family`
--
ALTER TABLE `Family`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `Human`
--
ALTER TABLE `Human`
  ADD PRIMARY KEY (`id`),
  ADD KEY `human_user_fk` (`id_user`);

--
-- Indices de la tabla `NPC`
--
ALTER TABLE `NPC`
  ADD PRIMARY KEY (`id`),
  ADD KEY `npc_campaign_fk` (`id_campaign`),
  ADD KEY `npc_digimon_fk` (`id_digimon`),
  ADD KEY `npc_human_fk` (`id_human`);

--
-- Indices de la tabla `OtherDigimon`
--
ALTER TABLE `OtherDigimon`
  ADD PRIMARY KEY (`id`),
  ADD KEY `wild_digimon_fk` (`id_digimon`);

--
-- Indices de la tabla `PartnerDigimon`
--
ALTER TABLE `PartnerDigimon`
  ADD PRIMARY KEY (`id`),
  ADD KEY `partner_digimon_fk` (`id_digimon`),
  ADD KEY `partner_digimon_user_fk` (`id_user`);

--
-- Indices de la tabla `Reward`
--
ALTER TABLE `Reward`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `Session`
--
ALTER TABLE `Session`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_campaign_fk` (`id_campaign`);

--
-- Indices de la tabla `Skill`
--
ALTER TABLE `Skill`
  ADD PRIMARY KEY (`id_skill`);

--
-- Indices de la tabla `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `User_Campaign`
--
ALTER TABLE `User_Campaign`
  ADD PRIMARY KEY (`id_uc`),
  ADD KEY `campaign_fk` (`id_campaign`),
  ADD KEY `user_fk` (`id_user`),
  ADD KEY `uc_human_fk` (`human_sheet`),
  ADD KEY `uc_partner_fk` (`partner_digimon`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Campaign`
--
ALTER TABLE `Campaign`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `CodeShard`
--
ALTER TABLE `CodeShard`
  MODIFY `id_shard` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `Digimon`
--
ALTER TABLE `Digimon`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT de la tabla `DigimonEvolution`
--
ALTER TABLE `DigimonEvolution`
  MODIFY `id_evo` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Human`
--
ALTER TABLE `Human`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `NPC`
--
ALTER TABLE `NPC`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `OtherDigimon`
--
ALTER TABLE `OtherDigimon`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `PartnerDigimon`
--
ALTER TABLE `PartnerDigimon`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `Reward`
--
ALTER TABLE `Reward`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `Session`
--
ALTER TABLE `Session`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `Skill`
--
ALTER TABLE `Skill`
  MODIFY `id_skill` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;

--
-- AUTO_INCREMENT de la tabla `User`
--
ALTER TABLE `User`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `User_Campaign`
--
ALTER TABLE `User_Campaign`
  MODIFY `id_uc` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `CodeShard`
--
ALTER TABLE `CodeShard`
  ADD CONSTRAINT `cs_uc_fk` FOREIGN KEY (`id_uc`) REFERENCES `User_Campaign` (`id_uc`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `Digimon`
--
ALTER TABLE `Digimon`
  ADD CONSTRAINT `digimon_family_fk` FOREIGN KEY (`family_tree`) REFERENCES `Family` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `DigimonEvolution`
--
ALTER TABLE `DigimonEvolution`
  ADD CONSTRAINT `base_digimon_fk` FOREIGN KEY (`base_digimon_id`) REFERENCES `Digimon` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `new_digimon_fk` FOREIGN KEY (`new_digimon_id`) REFERENCES `Digimon` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `Digimon_Skill`
--
ALTER TABLE `Digimon_Skill`
  ADD CONSTRAINT `digimon_skill_fk` FOREIGN KEY (`id_skill`) REFERENCES `Skill` (`id_skill`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `skill_digimon_fk` FOREIGN KEY (`id_digimon`) REFERENCES `Digimon` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `Human`
--
ALTER TABLE `Human`
  ADD CONSTRAINT `human_user_fk` FOREIGN KEY (`id_user`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `NPC`
--
ALTER TABLE `NPC`
  ADD CONSTRAINT `npc_campaign_fk` FOREIGN KEY (`id_campaign`) REFERENCES `Campaign` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `npc_digimon_fk` FOREIGN KEY (`id_digimon`) REFERENCES `OtherDigimon` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `npc_human_fk` FOREIGN KEY (`id_human`) REFERENCES `Human` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `OtherDigimon`
--
ALTER TABLE `OtherDigimon`
  ADD CONSTRAINT `wild_digimon_fk` FOREIGN KEY (`id_digimon`) REFERENCES `Digimon` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `PartnerDigimon`
--
ALTER TABLE `PartnerDigimon`
  ADD CONSTRAINT `partner_digimon_fk` FOREIGN KEY (`id_digimon`) REFERENCES `Digimon` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `partner_digimon_user_fk` FOREIGN KEY (`id_user`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `Session`
--
ALTER TABLE `Session`
  ADD CONSTRAINT `session_campaign_fk` FOREIGN KEY (`id_campaign`) REFERENCES `Campaign` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `User_Campaign`
--
ALTER TABLE `User_Campaign`
  ADD CONSTRAINT `campaign_fk` FOREIGN KEY (`id_campaign`) REFERENCES `Campaign` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `uc_human_fk` FOREIGN KEY (`human_sheet`) REFERENCES `Human` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `uc_partner_fk` FOREIGN KEY (`partner_digimon`) REFERENCES `PartnerDigimon` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_fk` FOREIGN KEY (`id_user`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
