// PMGC 2025 Teams and Players Data
import alphaGamingLogo from '../assets/GAUNTLET STAGE/Alpha Gaming/900px-Alpha_Gaming_2024_allmode.png';
import dXavierLogo from "../assets/GAUNTLET STAGE/D'Xavier/900px-Dingoz_Xavier_2024_allmode.png";
import eArenaLogo from '../assets/GAUNTLET STAGE/eArena/EArena2.png';
import virtusProLogo from '../assets/GAUNTLET STAGE/Virtus.pro/900px-Virtus.pro_2019_allmode.png';
import madbullsLogo from '../assets/GAUNTLET STAGE/Madbulls/900px-MadBulls_2024_allmode.png';
import regnumCaryaLogo from '../assets/GAUNTLET STAGE/Regnum Carya Esports/Regnum_Carya_Esports_2021_darkmode.png';
import ulfEsportsLogo from '../assets/GAUNTLET STAGE/ULF Esports/ULF_Esports_darkmode.png';
import karaEsportsLogo from '../assets/GAUNTLET STAGE/Kara Esports/900px-Kara_Esports_darkmode.png';
import gsTeamLogo from '../assets/GAUNTLET STAGE/GS Team/GS TEAM.png';
import r8EsportsLogo from '../assets/GAUNTLET STAGE/R8 Esports/900px-R8_Esports_2022_darkmode.png';
import geekayEsportsLogo from '../assets/GAUNTLET STAGE/Geekay Esports/900px-Geekay_Esports_2023_allmode.png';
import wolvesEsportsLogo from '../assets/GAUNTLET STAGE/Wolves Esports/900px-Wolves_Esports_allmode.png';
import alpha7EsportsLogo from '../assets/GAUNTLET STAGE/Alpha7 Esports/A7_eSports_darkmode.png';
import thunderTalkLogo from '../assets/GAUNTLET STAGE/ThunderTalk Gaming/ThunderTalk_Gaming_allmode.png';
import orangutanLogo from '../assets/GAUNTLET STAGE/Orangutan/900px-Orangutan_full_allmode.png';
import drxLogo from '../assets/GAUNTLET STAGE/DRX/900px-DRX_2023_full_darkmode.png';

// Group Green
import alterEgoLogo from '../assets/GROUP STAGE/GROUP GREEN/Alter Ego Ares/900px-Alter_Ego_2022_allmode.png';
import teamSecretLogo from '../assets/GROUP STAGE/GROUP GREEN/Team Secret/900px-Team_Secret_full_darkmode.png';
import innerCircleLogo from '../assets/GROUP STAGE/GROUP GREEN/Inner Circle Esports/900px-Inner_Circle_Esports_PUBGM_allmode.png';
import goatTeamLogo from '../assets/GROUP STAGE/GROUP GREEN/GOAT Team/900px-GOAT_TEAM_allmode.png';
import teamFalconsLogo from '../assets/GROUP STAGE/GROUP GREEN/Team Falcons/900px-Team_Falcons_2022_full_darkmode.png';
import paparaLogo from '../assets/GROUP STAGE/GROUP GREEN/Papara SuperMassive/900px-Papara_SuperMassive_Aug_2023_full_darkmode.png';
import gengLogo from '../assets/GROUP STAGE/GROUP GREEN/Gen.G Esports/GEN.G.png';
import loopsLogo from '../assets/GROUP STAGE/GROUP GREEN/Loops Esports/Loops_Esports_2021_allmode.png';
import ninezLogo from '../assets/GROUP STAGE/GROUP GREEN/9z Team/900px-9z_Team_2024_darkmode.png';
import tianbaLogo from '../assets/GROUP STAGE/GROUP GREEN/Tianba/Tianba_2020_allmode.png';
import dplusLogo from '../assets/GROUP STAGE/GROUP GREEN/Dplus/900px-Dplus_darkmode.png';
import rejectLogo from '../assets/GROUP STAGE/GROUP GREEN/REJECT/900px-REJECT_2020_full_darkmode.png';

// Group Red
import allianceLogo from '../assets/GROUP STAGE/GROUP RED/CelcomDigi Alliance/900px-CelcomDigi_Alliance_darkmode.png';
import burmeseLogo from '../assets/GROUP STAGE/GROUP RED/Burmese Ghouls/900px-Burmese_Ghouls_2023_allmode.png';
import teamFlashLogo from '../assets/GROUP STAGE/GROUP RED/Team Flash/900px-Team_Flash_full_darkmode.png';
import arcredLogo from '../assets/GROUP STAGE/GROUP RED/ARCRED/900px-ARCRED_2025_allmode.png';
import boarsLogo from '../assets/GROUP STAGE/GROUP RED/Boars Gaming/900px-Boars_Gaming_allmode.png';
import twistedMindsLogo from '../assets/GROUP STAGE/GROUP RED/Twisted Minds/900px-Twisted_Minds_2023_full_darkmode.png';
import nuclearZoneLogo from '../assets/GROUP STAGE/GROUP RED/Nuclear Zone/Dark Purple Modern 3D Illustrative Artificial Intelligence Instagram Post.png';
import influenceRageLogo from '../assets/GROUP STAGE/GROUP RED/INFLUENCE RAGE/900px-Influence_Rage_2023_allmode.png';
import etshLogo from '../assets/GROUP STAGE/GROUP RED/ETSH Esports/ChatGPT Image Nov 7, 2025, 04_49_42 PM.png';
import trueRippersLogo from '../assets/GROUP STAGE/GROUP RED/TRUE RIPPERS/True_Rippers_darkmode.png';
import weiboLogo from '../assets/GROUP STAGE/GROUP RED/Weibo Gaming/900px-Weibo_Gaming_full_darkmode.png';

// Grand Finals
import vampireLogo from '../assets/GRAND FINALS/Vampire Esports/900px-Vampire_Esports_2022_full_darkmode.png';

export const pmgcTeams = {
  gauntlet: [
    {
      id: 'alpha-gaming',
      name: 'Alpha Gaming',
      logo: alphaGamingLogo,
      region: 'PMSL CSA',
      players: [
        { name: 'TOP', image: '/src/assets/GAUNTLET STAGE/Alpha Gaming/PLAYERS/TOP.png' },
        { name: 'BARON', image: '/src/assets/GAUNTLET STAGE/Alpha Gaming/PLAYERS/BARON.png' },
        { name: 'DOK', image: '/src/assets/GAUNTLET STAGE/Alpha Gaming/PLAYERS/DOK.png' },
        { name: 'REFUSS', image: '/src/assets/GAUNTLET STAGE/Alpha Gaming/PLAYERS/REFUSS.png' },
        { name: 'ZYOLL', image: '/src/assets/GAUNTLET STAGE/Alpha Gaming/PLAYERS/ZYOLL.png' },
        { name: 'EAST', image: '/src/assets/GAUNTLET STAGE/Alpha Gaming/PLAYERS/EAST.png' },

      ]
    },
    {
      id: 'dxavier',
      name: "D'Xavier",
      logo: dXavierLogo,
      region: 'PMSL SEA',
      players: [
        { name: 'SHIN', image: "/src/assets/GAUNTLET STAGE/D'Xavier/PLAYERS/SHIN.png" },
        { name: 'NADETII', image: "/src/assets/GAUNTLET STAGE/D'Xavier/PLAYERS/NADETII.png" },
        { name: 'PARAJIN', image: "/src/assets/GAUNTLET STAGE/D'Xavier/PLAYERS/PARAJIN.png" },
        { name: 'LEVIS', image: "/src/assets/GAUNTLET STAGE/D'Xavier/PLAYERS/LEVIS.png" },
        { name: 'LAMBORGHINI', image: "/src/assets/GAUNTLET STAGE/D'Xavier/PLAYERS/LAMBORGHINI.png" }
      ]
    },
    {
      id: 'earena',
      name: 'eArena',
      logo: eArenaLogo,
      region: 'PMSL SEA',
      players: [
        { name: 'TernyK', image: '/src/assets/GAUNTLET STAGE/eArena/PLAYERS/TernyK.png' },
        { name: 'Nc2', image: '/src/assets/GAUNTLET STAGE/eArena/PLAYERS/Nc2.png' },
        { name: 'MORMAN', image: '/src/assets/GAUNTLET STAGE/eArena/PLAYERS/MORMAN2.png' },
        { name: 'SAKRUA', image: '/src/assets/GAUNTLET STAGE/eArena/PLAYERS/SAKRUA.png' },
        { name: 'JOWKER', image: '/src/assets/GAUNTLET STAGE/eArena/PLAYERS/JOWKER2.png' }
      ]
    },
    {
      id: 'virtus-pro',
      name: 'Virtus.pro',
      logo: virtusProLogo,
      region: 'PMSL CSA',
      players: [
        { name: 'Voston', image: '/src/assets/GAUNTLET STAGE/Virtus.pro/PLAYERS/Voston.png' },
        { name: 'ERAGON', image: '/src/assets/GAUNTLET STAGE/Virtus.pro/PLAYERS/ERAGON.png' },
        { name: 'MALOYYY', image: '/src/assets/GAUNTLET STAGE/Virtus.pro/PLAYERS/MALOYYY.png' },
        { name: 'MilkyWay', image: '/src/assets/GAUNTLET STAGE/Virtus.pro/PLAYERS/MilkyWay.png' },
        { name: 'FURIA', image: '/src/assets/GAUNTLET STAGE/Virtus.pro/PLAYERS/FURIAA.png' }
      ]
    },
    {
      id: 'madbulls',
      name: 'Madbulls',
      logo: madbullsLogo,
      region: 'PMSL CSA',
      players: [
        { name: 'TUL1KA', image: '/src/assets/GAUNTLET STAGE/Madbulls/PLAYERS/TUL1KA.png' },
        { name: 'FLIP', image: '/src/assets/GAUNTLET STAGE/Madbulls/PLAYERS/FLIP.png' },
        { name: 'LEMON', image: '/src/assets/GAUNTLET STAGE/Madbulls/PLAYERS/LEMON.png' },
        { name: 'PUSHER', image: '/src/assets/GAUNTLET STAGE/Madbulls/PLAYERS/PUSHER.png' },
      ]
    },
    {
      id: 'regnum-carya',
      name: 'Regnum Carya Esports',
      logo: regnumCaryaLogo,
      region: 'PMSL EU',
      players: [
        { name: 'SYLAS', image: '/src/assets/GAUNTLET STAGE/Regnum Carya Esports/PLAYERS/SYLAS.png' },
        { name: 'LOXY', image: '/src/assets/GAUNTLET STAGE/Regnum Carya Esports/PLAYERS/LOXY.png' },
        { name: 'WILD', image: '/src/assets/GAUNTLET STAGE/Regnum Carya Esports/PLAYERS/WILD.png' },
        { name: 'LOXY', image: '/src/assets/GAUNTLET STAGE/Regnum Carya Esports/PLAYERS/ZWOLF.png' },
      ]
    },
    {
      id: 'ulf-esports',
      name: 'ULF Esports',
      logo: ulfEsportsLogo,
      region: 'PMSL EU',
      players: [
        { name: 'SCARFACE', image: '/src/assets/GAUNTLET STAGE/ULF Esports/PLAYERS/SCARFACE.png' },
        { name: 'SOULLESS', image: '/src/assets/GAUNTLET STAGE/ULF Esports/PLAYERS/SOULLESS.png' },
        { name: 'EREN7', image: '/src/assets/GAUNTLET STAGE/ULF Esports/PLAYERS/EREN7.png' },
        { name: 'KECTH', image: '/src/assets/GAUNTLET STAGE/ULF Esports/PLAYERS/KECTH.png' },
      ]
    },
    {
      id: 'kara-esports',
      name: 'Kara Esports',
      logo: karaEsportsLogo,
      region: 'PMSL EU',
      players: [
        { name: 'LEWIS', image: '/src/assets/GAUNTLET STAGE/Kara Esports/PLAYERS/LEWIS.png' },
        { name: 'MARS', image: '/src/assets/GAUNTLET STAGE/Kara Esports/PLAYERS/MARS.png' },
        { name: 'POSER', image: '/src/assets/GAUNTLET STAGE/Kara Esports/PLAYERS/POSER.png' },
        { name: 'CEOLATER', image: '/src/assets/GAUNTLET STAGE/Kara Esports/PLAYERS/CEO.png' },
      ]
    },
    {
      id: 'gs-team',
      name: 'GS Team',
      logo: gsTeamLogo,
      region: 'PMSL MENA',
      players: [
        { name: 'D3S', image: '/src/assets/GAUNTLET STAGE/GS TEAM/PLAYERS/D3S.png' },
        { name: 'ESPORT', image: '/src/assets/GAUNTLET STAGE/GS TEAM/PLAYERS/ESPORT.png' },
        { name: 'ICON77', image: '/src/assets/GAUNTLET STAGE/GS TEAM/PLAYERS/ICON77.png' },
        { name: 'J3', image: '/src/assets/GAUNTLET STAGE/GS TEAM/PLAYERS/J3.png' },
        { name: 'AMIR', image: '/src/assets/GAUNTLET STAGE/GS TEAM/PLAYERS/AMIR.png' }
      ]
    },
    {
      id: 'r8-esports',
      name: 'R8 Esports',
      logo: r8EsportsLogo,
      region: 'PMSL MENA',
      players: [
        { name: 'Marth', image: '/src/assets/GAUNTLET STAGE/R8 Esports/PLAYERS/Marth.png' },
        { name: 'iD7', image: '/src/assets/GAUNTLET STAGE/R8 Esports/PLAYERS/iD7.png' },
        { name: 'SKTON', image: '/src/assets/GAUNTLET STAGE/R8 Esports/PLAYERS/SKTON.png' },
        { name: 'PRESTLGE', image: '/src/assets/GAUNTLET STAGE/R8 Esports/PLAYERS/PRESTLGE.png' },
        { name: 'DAMAR', image: '/src/assets/GAUNTLET STAGE/R8 Esports/PLAYERS/DAMAR.png' },
        { name: '3MORE', image: '/src/assets/GAUNTLET STAGE/R8 Esports/PLAYERS/3MORE.png' },
      ]
    },
    {
      id: 'geekay-esports',
      name: 'Geekay Esports',
      logo: geekayEsportsLogo,
      region: 'PMSL MENA',
      players: [
        { name: 'SSS', image: '/src/assets/GAUNTLET STAGE/Geekay Esports/PLAYERS/SSS.png' },
        { name: 'KEVIN', image: '/src/assets/GAUNTLET STAGE/Geekay Esports/PLAYERS/KEVIN.png' },
        { name: 'RAGNAROK', image: '/src/assets/GAUNTLET STAGE/Geekay Esports/PLAYERS/RAGNAROK.png' },
        { name: 'NIRZED', image: '/src/assets/GAUNTLET STAGE/Geekay Esports/PLAYERS/NIRZED.png' },
        { name: 'BERLIN', image: '/src/assets/GAUNTLET STAGE/Geekay Esports/PLAYERS/BERLIN.png' },
        { name: 'SAFG', image: '/src/assets/GAUNTLET STAGE/Geekay Esports/PLAYERS/SAFG.png' },
      ]
    },
    {
      id: 'wolves-esports',
      name: 'Wolves Esports',
      logo: wolvesEsportsLogo,
      region: 'PMSL AM',
      players: [
        { name: 'KOOPS', image: '/src/assets/GAUNTLET STAGE/Wolves Esports/PLAYERS/KOOPS.png' },
        { name: 'BATONNJJKK', image: '/src/assets/GAUNTLET STAGE/Wolves Esports/PLAYERS/BATONNJJKK.png' },
        { name: 'DORIN', image: '/src/assets/GAUNTLET STAGE/Wolves Esports/PLAYERS/DORIN.png' },
        { name: 'JUANCHO', image: '/src/assets/GAUNTLET STAGE/Wolves Esports/PLAYERS/JUANCHO.png' },
        { name: 'HIGOR', image: '/src/assets/GAUNTLET STAGE/Wolves Esports/PLAYERS/HIGORZD.png' },
      ]
    },
    {
      id: 'alpha7-esports',
      name: 'Alpha7 Esports',
      logo: alpha7EsportsLogo,
      region: 'PMSL AM',
      players: [
        { name: 'REVO', image: '/src/assets/GAUNTLET STAGE/Alpha7 Esports/PLAYERS/REVO.png' },
        { name: 'CARRILHO', image: '/src/assets/GAUNTLET STAGE/Alpha7 Esports/PLAYERS/CARRILHO.png' },
        { name: 'GUIZAO', image: '/src/assets/GAUNTLET STAGE/Alpha7 Esports/PLAYERS/GUIZAO.png' },
        { name: 'OBSCURE', image: '/src/assets/GAUNTLET STAGE/Alpha7 Esports/PLAYERS/OBSCURE.png' },
        { name: 'MAFIOSO', image: '/src/assets/GAUNTLET STAGE/Alpha7 Esports/PLAYERS/MAFIOSO.png' },
      ]
    },
    {
      id: 'thundertalk',
      name: 'ThunderTalk Gaming',
      logo: thunderTalkLogo,
      region: 'PEL',
      players: [
        { name: 'KING', image: '/src/assets/GAUNTLET STAGE/ThunderTalk Gaming/PLAYERS/KING.png' },
        { name: 'AJAY', image: '/src/assets/GAUNTLET STAGE/ThunderTalk Gaming/PLAYERS/AJAY.png' },
        { name: 'XING', image: '/src/assets/GAUNTLET STAGE/ThunderTalk Gaming/PLAYERS/XING.png' },
        { name: 'TIANYU', image: '/src/assets/GAUNTLET STAGE/ThunderTalk Gaming/PLAYERS/TIANYU.png' },
        { name: 'SITING', image: '/src/assets/GAUNTLET STAGE/ThunderTalk Gaming/PLAYERS/SITING.png' },

      ]
    },
    {
      id: 'orangutan',
      name: 'Orangutan',
      logo: orangutanLogo,
      region: 'BGIS',
      players: [
        { name: 'AARU', image: '/src/assets/GAUNTLET STAGE/ORANGUTAN/PLAYERS/AARU.png' },
        { name: 'WIZZGOD', image: '/src/assets/GAUNTLET STAGE/ORANGUTAN/PLAYERS/WIZZGOD.png' },
        { name: 'AKOP', image: '/src/assets/GAUNTLET STAGE/ORANGUTAN/PLAYERS/AKOP.png' },
        { name: 'ATTANKI', image: '/src/assets/GAUNTLET STAGE/ORANGUTAN/PLAYERS/ATTANKI.png' },
      ]
    },
    {
      id: 'drx',
      name: 'DRX',
      logo: drxLogo,
      region: 'BMIC',
      players: [
        { name: 'SOEZ', image: '/src/assets/GAUNTLET STAGE/DRX/PLAYERS/SOEZ.png' },
        { name: 'HYUNBIN', image: '/src/assets/GAUNTLET STAGE/DRX/PLAYERS/HYUNBIN.png' },
        { name: 'CYXAE', image: '/src/assets/GAUNTLET STAGE/DRX/PLAYERS/CYXAE.png' },
        { name: 'QX', image: '/src/assets/GAUNTLET STAGE/DRX/PLAYERS/QXZZZ.png' },
      ]
    }
  ],

  groupStage: {
    green: [
      // Direct Qualifiers (7 teams)
      {
        id: 'alter-ego',
        name: 'Alter Ego Ares',
        logo: alterEgoLogo,
        region: 'PMSL SEA',
        qualifiedFrom: ' Indonesia Points',
        players: [
          { name: 'ALVA', image: '/src/assets/GROUP STAGE/GROUP GREEN/Alter Ego Ares/PLAYERS/ALVA.png' },
          { name: 'KRYPTON', image: '/src/assets/GROUP STAGE/GROUP GREEN/Alter Ego Ares/PLAYERS/KRYPTON.png' },
          { name: 'MOANA', image: '/src/assets/GROUP STAGE/GROUP GREEN/Alter Ego Ares/PLAYERS/MOANA.png' },
          { name: 'ROSEMARY', image: '/src/assets/GROUP STAGE/GROUP GREEN/Alter Ego Ares/PLAYERS/ROSEMARY.png' },
          { name: 'SNAPE', image: '/src/assets/GROUP STAGE/GROUP GREEN/Alter Ego Ares/PLAYERS/SNAPE.png' },
        ]
      },
      {
        id: 'team-secret',
        name: 'Team Secret',
        logo: teamSecretLogo,
        region: ' PMSL SEA',
        qualifiedFrom: 'Formerly TH Points',
        players: [
          { name: 'FRANKY', image: '/src/assets/GROUP STAGE/GROUP GREEN/Team Secret/PLAYERS/FRANKY.png' },
          { name: 'JIKEY', image: '/src/assets/GROUP STAGE/GROUP GREEN/Team Secret/PLAYERS/JIKEY.png' },
          { name: 'JUKEY', image: '/src/assets/GROUP STAGE/GROUP GREEN/Team Secret/PLAYERS/JUKAY.png' },
          { name: 'DOKI', image: '/src/assets/GROUP STAGE/GROUP GREEN/Team Secret/PLAYERS/DOKI.png' },
          { name: 'ZERUS', image: '/src/assets/GROUP STAGE/GROUP GREEN/Team Secret/PLAYERS/ZERUS.png' },
        ]
      },
      {
        id: 'inner-circle',
        name: 'Inner Circle Esports',
        logo: innerCircleLogo,
        region: 'PMSL CSA',
        qualifiedFrom: 'PAKISTAN POINTS',
        players: [
          { name: 'IQ', image: '/src/assets/GROUP STAGE/GROUP GREEN/Inner Circle Esports/PLAYERS/IQ.png' },
          { name: 'FALAK', image: '/src/assets/GROUP STAGE/GROUP GREEN/Inner Circle Esports/PLAYERS/FALAK.png' },
          { name: 'NOCKI', image: '/src/assets/GROUP STAGE/GROUP GREEN/Inner Circle Esports/PLAYERS/NOCKI.png' },
          { name: 'T24 OP', image: '/src/assets/GROUP STAGE/GROUP GREEN/Inner Circle Esports/PLAYERS/T24 OP.png' },
          { name: 'CAIRO', image: '/src/assets/GROUP STAGE/GROUP GREEN/Inner Circle Esports/PLAYERS/CAIRO.png' }
        ]
      },
      {
        id: 'goat-team',
        name: 'GOAT Team',
        logo: goatTeamLogo,
        region: 'PMSL CSA',
        qualifiedFrom: 'Formerly CA Points',
        players: [
          { name: 'TW1X', image: '/src/assets/GROUP STAGE/GROUP GREEN/GOAT Team/PLAYERS/TW1X.png' },
          { name: 'KILLERJOE', image: '/src/assets/GROUP STAGE/GROUP GREEN/GOAT Team/PLAYERS/KILLERJOE.png' },
          { name: 'VARENIK', image: '/src/assets/GROUP STAGE/GROUP GREEN/GOAT Team/PLAYERS/VARENIK.png' },
          { name: 'V1C', image: '/src/assets/GROUP STAGE/GROUP GREEN/GOAT Team/PLAYERS/V1C.png' },
          { name: 'KRAKEN', image: '/src/assets/GROUP STAGE/GROUP GREEN/GOAT Team/PLAYERS/KRAKEN.png' },
        ]
      },
      {
        id: 'team-falcons',
        name: 'Team Falcons',
        logo: teamFalconsLogo,
        region: 'PMSL EU',
        qualifiedFrom: 'Western Europe Points',
        players: [

          { name: 'RAOUF', image: '/src/assets/GROUP STAGE/GROUP GREEN/Team Falcons/PLAYERS/RAOUF.png' },
          { name: 'COA77', image: '/src/assets/GROUP STAGE/GROUP GREEN/Team Falcons/PLAYERS/COA77.png' },
          { name: 'NARVALOW', image: '/src/assets/GROUP STAGE/GROUP GREEN/Team Falcons/PLAYERS/NARVALOW.png' },
          { name: 'REDOX', image: '/src/assets/GROUP STAGE/GROUP GREEN/Team Falcons/PLAYERS/REDOX.png' },
        ]
      },
      {
        id: 'papara-supermassive',
        name: 'Papara SuperMassive',
        logo: paparaLogo,
        region: 'PMSL EU',
        qualifiedFrom: 'Formerly Turkiye Points',
        players: [
          { name: 'REDOX', image: '/src/assets/GROUP STAGE/GROUP GREEN/Papara SuperMassive/PLAYERS/KAMIKAZE.png' },
          { name: 'LOST', image: '/src/assets/GROUP STAGE/GROUP GREEN/Papara SuperMassive/PLAYERS/LOST.png' },
          { name: 'NYKO', image: '/src/assets/GROUP STAGE/GROUP GREEN/Papara SuperMassive/PLAYERS/NYKO.png' },
          { name: 'TRON', image: '/src/assets/GROUP STAGE/GROUP GREEN/Papara SuperMassive/PLAYERS/TRON.png' },
        ]
      },
      {
        id: 'gen.g-esports',
        name: 'Gen.G Esports',
        logo: gengLogo,
        region: 'PMSL MENA',
        qualifiedFrom: 'Direct Qualification',
        players: [
          { name: 'AGAIN', image: '/src/assets/GROUP STAGE/GROUP GREEN/Gen.G Esports/PLAYERS/AGAIN.png' },
          { name: 'DAMI', image: '/src/assets/GROUP STAGE/GROUP GREEN/Gen.G Esports/PLAYERS/DAMI.png' },
          { name: 'SATAN', image: '/src/assets/GROUP STAGE/GROUP GREEN/Gen.G Esports/PLAYERS/SATAN.png' },
          { name: 'YOUSSEF', image: '/src/assets/GROUP STAGE/GROUP GREEN/Gen.G Esports/PLAYERS/YOUSSEF.png' },
          { name: 'ARTFUL', image: '/src/assets/GROUP STAGE/GROUP GREEN/Gen.G Esports/PLAYERS/ARTFUL.png' },
        ]
      },
      // From Regional Points (5 teams)
      {
        id: 'loops-esports',
        name: 'Loops Esports',
        logo: loopsLogo,
        region: 'PMSL AM',
        qualifiedFrom: 'Formerly BR PointS',
        players: [
          { name: 'NEILZADA', image: '/src/assets/GROUP STAGE/GROUP GREEN/Loops Esports/PLAYERS/NIELZADA.png' },
          { name: 'NINHO', image: '/src/assets/GROUP STAGE/GROUP GREEN/Loops Esports/PLAYERS/NINHO.png' },
          { name: 'RAFINHA', image: '/src/assets/GROUP STAGE/GROUP GREEN/Loops Esports/PLAYERS/RAFINHA.png' },
          { name: 'RATOBOY', image: '/src/assets/GROUP STAGE/GROUP GREEN/Loops Esports/PLAYERS/RATOBOY.png' },
          { name: 'VITINN', image: '/src/assets/GROUP STAGE/GROUP GREEN/Loops Esports/PLAYERS/VITIN.png' },
        ]
      },
      {
        id: '9z-team',
        name: '9z Team',
        logo: ninezLogo,
        region: 'PMSL AM',
        qualifiedFrom: 'LATAM Points',
        players: [
          { name: 'MILOS', image: '/src/assets/GROUP STAGE/GROUP GREEN/9z Team/PLAYERS/MILOS.png' },
          { name: 'REMIX', image: '/src/assets/GROUP STAGE/GROUP GREEN/9z Team/PLAYERS/REMIX.png' },
          { name: 'COLEGA', image: '/src/assets/GROUP STAGE/GROUP GREEN/9z Team/PLAYERS/COLEGOAT.png' },
          { name: 'REYES', image: '/src/assets/GROUP STAGE/GROUP GREEN/9z Team/PLAYERS/REYES.png' },
        ]
      },
      {
        id: 'tianba',
        name: 'Tianba',
        logo: tianbaLogo,
        region: 'PEL',
        qualifiedFrom: 'PEL Points',
        players: [
          { name: 'QZ', image: '/src/assets/GROUP STAGE/GROUP GREEN/TIANBA/PLAYERS/QZ.png' },
          { name: 'GGBOND', image: '/src/assets/GROUP STAGE/GROUP GREEN/TIANBA/PLAYERS/GGBOND.png' },
          { name: 'ACHING', image: '/src/assets/GROUP STAGE/GROUP GREEN/TIANBA/PLAYERS/ACHING.png' },
          { name: 'MILU', image: '/src/assets/GROUP STAGE/GROUP GREEN/TIANBA/PLAYERS/MILU.png' },
          { name: 'YUYANG', image: '/src/assets/GROUP STAGE/GROUP GREEN/TIANBA/PLAYERS/YUYANG.png' },
          { name: '宝', image: '/src/assets/GROUP STAGE/GROUP GREEN/TIANBA/PLAYERS/宝.png' },

        ]
      },
      {
        id: 'dplus',
        name: 'Dplus',
        logo: dplusLogo,
        region: 'KOREA',
        qualifiedFrom: 'Korea Points',
        players: [
          { name: 'CHPZ', image: '/src/assets/GROUP STAGE/GROUP GREEN/DPLUS/PLAYERS/CHPZ.png' },
          { name: 'FOREST', image: '/src/assets/GROUP STAGE/GROUP GREEN/DPLUS/PLAYERS/FOREST.png' },
          { name: 'OSAL', image: '/src/assets/GROUP STAGE/GROUP GREEN/DPLUS/PLAYERS/OSAL.png' },
          { name: 'NOLBU', image: '/src/assets/GROUP STAGE/GROUP GREEN/DPLUS/PLAYERS/NOLBU.png' },
          { name: 'FAVIAN', image: '/src/assets/GROUP STAGE/GROUP GREEN/DPLUS/PLAYERS/CHPZ.png' },
        ]
      },
      {
        id: 'reject',
        name: 'REJECT',
        logo: rejectLogo,
        region: 'Japan League',
        qualifiedFrom: 'Japan',
        players: [
          { name: 'APOLLO', image: '/src/assets/GROUP STAGE/GROUP GREEN/REJECT/PLAYERS/APOLLO.jpg' },
          { name: 'SARA', image: '/src/assets/GROUP STAGE/GROUP GREEN/REJECT/PLAYERS/SARA.png' },
          { name: 'REIJIOCO', image: '/src/assets/GROUP STAGE/GROUP GREEN/REJECT/PLAYERS/REIJIOCO.png' },
          { name: 'DUELO', image: '/src/assets/GROUP STAGE/GROUP GREEN/REJECT/PLAYERS/DUELO.png' },
          { name: 'DEVINE', image: '/src/assets/GROUP STAGE/GROUP GREEN/REJECT/PLAYERS/DEVINE.png' },
        ]
      },
      // Placeholders for Gauntlet qualifiers (4 teams - positions 9, 13, 15, and one more)
      {
        id: 'gauntlet-green-1',
        name: 'The Gauntlet #9',
        logo: '/placeholder-logo.png',
        region: 'TBD',
        qualifiedFrom: 'The Gauntlet',
        isPlaceholder: true,
        players: []
      },
      {
        id: 'gauntlet-green-2',
        name: 'The Gauntlet #13',
        logo: '/placeholder-logo.png',
        region: 'TBD',
        qualifiedFrom: 'The Gauntlet',
        isPlaceholder: true,
        players: []
      },
      {
        id: 'gauntlet-green-3',
        name: 'The Gauntlet #15',
        logo: '/placeholder-logo.png',
        region: 'TBD',
        qualifiedFrom: 'The Gauntlet',
        isPlaceholder: true,
        players: []
      },
      {
        id: 'gauntlet-green-4',
        name: 'The Gauntlet #16',
        logo: '/placeholder-logo.png',
        region: 'TBD',
        qualifiedFrom: 'The Gauntlet',
        isPlaceholder: true,
        players: []
      }
    ],
    red: [
      // Direct Qualifiers (7 teams)
      {
        id: 'alliance-my',
        name: 'Alliance MY',
        logo: allianceLogo,
        region: 'PMSL SEA',
        qualifiedFrom: 'Malaysia Points',
        players: [
          { name: 'ADIKLUQ', image: '/src/assets/GROUP STAGE/GROUP RED/CelcomDigi Alliance/PLAYERS/KLUQ.png' },
          { name: 'OLIYO', image: '/src/assets/GROUP STAGE/GROUP RED/CelcomDigi Alliance/PLAYERS/OLIYO.png' },
          { name: 'JIMMY', image: '/src/assets/GROUP STAGE/GROUP RED/CelcomDigi Alliance/PLAYERS/JIMMY.png' },
          { name: 'IFTAR', image: '/src/assets/GROUP STAGE/GROUP RED/CelcomDigi Alliance/PLAYERS/IFTAR.png' },
          { name: 'XYNBOY', image: '/src/assets/GROUP STAGE/GROUP RED/CelcomDigi Alliance/PLAYERS/XYNBOY.png' },
          { name: 'LEONDZ', image: '/src/assets/GROUP STAGE/GROUP RED/CelcomDigi Alliance/PLAYERS/LEONDZ.png' },
        ]
      },
      {
        id: 'burmese-ghouls',
        name: 'Burmese Ghouls',
        logo: burmeseLogo,
        region: 'PMCL SEA',
        qualifiedFrom: 'Direct Qualification',
        players: [
          { name: 'UNKNOWN', image: '/src/assets/GROUP STAGE/GROUP RED/Burmese Ghouls/PLAYERS/UNKNOWN.png' },
          { name: 'ICHI', image: '/src/assets/GROUP STAGE/GROUP RED/Burmese Ghouls/PLAYERS/ICHI.png' },
          { name: 'YATKHA', image: '/src/assets/GROUP STAGE/GROUP RED/Burmese Ghouls/PLAYERS/YATKHA.png' },
          { name: 'GODSPEED', image: '/src/assets/GROUP STAGE/GROUP RED/Burmese Ghouls/PLAYERS/GODSPEED.png' },

        ]
      },
      {
        id: 'team-flash',
        name: 'Team Flash',
        logo: teamFlashLogo,
        region: 'PMSL SEA',
        qualifiedFrom: 'Formerly VN Points',
        players: [
          { name: 'WIN', image: '/src/assets/GROUP STAGE/GROUP RED/Team FLASH/PLAYERS/WIN.png' },
          { name: 'ZHIUS', image: '/src/assets/GROUP STAGE/GROUP RED/Team FLASH/PLAYERS/ZHIUS.png' },
          { name: 'BOWZ', image: '/src/assets/GROUP STAGE/GROUP RED/Team FLASH/PLAYERS/BOWZ.png' },
          { name: 'TOPZ', image: '/src/assets/GROUP STAGE/GROUP RED/Team FLASH/PLAYERS/TOPZ.png' },
          { name: 'HADE', image: '/src/assets/GROUP STAGE/GROUP RED/Team FLASH/PLAYERS/HADE.png' },
        ]
      },
      {
        id: 'arcred',
        name: 'ARCRED',
        logo: arcredLogo,
        region: 'Uzbekistan Points',
        qualifiedFrom: 'Direct Qualification',
        players: [
          { name: 'BADBOY', image: '/src/assets/GROUP STAGE/GROUP RED/ARCRED/PLAYERS/BADBOY.png' },
          { name: 'HARDBOY', image: '/src/assets/GROUP STAGE/GROUP RED/ARCRED/PLAYERS/HARDBOY.png' },
          { name: 'RAMZES', image: '/src/assets/GROUP STAGE/GROUP RED/ARCRED/PLAYERS/RAMES.png' },
          { name: 'GLORY', image: '/src/assets/GROUP STAGE/GROUP RED/ARCRED/PLAYERS/GLORY.png' },
        ]
      },
      {
        id: 'boars-gaming',
        name: 'Boars Gaming',
        logo: boarsLogo,
        region: 'PMSL EU',
        qualifiedFrom: 'Eastern Europe Points',
        players: [

          { name: 'EXO', image: '/src/assets/GROUP STAGE/GROUP RED/Boars Gaming/PLAYERS/EXO.png' },
          { name: 'HAVLIK', image: '/src/assets/GROUP STAGE/GROUP RED/Boars Gaming/PLAYERS/HAVLIK.png' },
          { name: 'KVIQQ', image: '/src/assets/GROUP STAGE/GROUP RED/Boars Gaming/PLAYERS/KVIQQ.png' },
          { name: 'SNOWIX', image: '/src/assets/GROUP STAGE/GROUP RED/Boars Gaming/PLAYERS/SNOWIX.png' },
          { name: 'CAUS', image: '/src/assets/GROUP STAGE/GROUP RED/Boars Gaming/PLAYERS/CAUS.png' },
        ]
      },
      {
        id: 'twisted-minds',
        name: 'Twisted Minds',
        logo: twistedMindsLogo,
        region: 'PMSL MENA',
        qualifiedFrom: 'Iraq Points',
        players: [
          { name: 'LORD', image: '/src/assets/GROUP STAGE/GROUP RED/Twisted Minds/PLAYERS/LORD.png' },
          { name: 'FREAK', image: '/src/assets/GROUP STAGE/GROUP RED/Twisted Minds/PLAYERS/FREAK.png' },
          { name: '4YDO', image: '/src/assets/GROUP STAGE/GROUP RED/Twisted Minds/PLAYERS/4YDO.png' },
          { name: 'WA7SH', image: '/src/assets/GROUP STAGE/GROUP RED/Twisted Minds/PLAYERS/WA7SH.png' },
        ]
      },
      {
        id: 'nuclear-zone',
        name: 'Nuclear Zone',
        logo: nuclearZoneLogo,
        region: 'PMSL MENA',
        qualifiedFrom: 'Egypt Points',
        players: [
          { name: 'ARTHUR', image: '/src/assets/GROUP STAGE/GROUP RED/Nuclear Zone/PLAYERS/ARTHUR.png' },
          { name: 'APKRINO', image: '/src/assets/GROUP STAGE/GROUP RED/Nuclear Zone/PLAYERS/APKRINO.png' },
          { name: 'CRONA9', image: '/src/assets/GROUP STAGE/GROUP RED/Nuclear Zone/PLAYERS/CRONA9.png' },
          { name: 'ABUDY', image: '/src/assets/GROUP STAGE/GROUP RED/Nuclear Zone/PLAYERS/ABUDY.png' },
          { name: 'FAHITA', image: '/src/assets/GROUP STAGE/GROUP RED/Nuclear Zone/PLAYERS/FAHITA.png' },
        ]
      },
      // From Regional Points (4 teams)
      {
        id: 'influence-rage',
        name: 'INFLUENCE RAGE',
        logo: influenceRageLogo,
        region: 'PMSL AM',
        qualifiedFrom: 'Formerly NA Points',
        players: [
          { name: 'DIEGO', image: '/src/assets/GROUP STAGE/GROUP RED/Influence Rage/PLAYERS/DIEGO.png' },
          { name: 'FEDERAL', image: '/src/assets/GROUP STAGE/GROUP RED/Influence Rage/PLAYERS/FEDERAL.png' },
          { name: 'LAW', image: '/src/assets/GROUP STAGE/GROUP RED/Influence Rage/PLAYERS/LAW.png' },
          { name: 'LILBOY', image: '/src/assets/GROUP STAGE/GROUP RED/Influence Rage/PLAYERS/LILBOY.png' },
          { name: 'LORRANZIN', image: '/src/assets/GROUP STAGE/GROUP RED/Influence Rage/PLAYERS/LORRANZIN.png' },
        ]
      },
      {
        id: 'etsh-esports',
        name: 'ETSH Esports',
        logo: etshLogo,
        region: 'Africa Cup',
        qualifiedFrom: 'Direct Qualification',
        players: [
          { name: 'NASSER', image: '/src/assets/GROUP STAGE/GROUP RED/ETSH/PLAYERS/NASSER.png' },
          { name: 'REVERB', image: '/src/assets/GROUP STAGE/GROUP RED/ETSH/PLAYERS/REVERB.png' },
          { name: 'BABY', image: '/src/assets/GROUP STAGE/GROUP RED/ETSH/PLAYERS/BABY.png' },
          { name: 'SHIVA', image: '/src/assets/GROUP STAGE/GROUP RED/ETSH/PLAYERS/SHIVA.png' },
          { name: 'KUZA', image: '/src/assets/GROUP STAGE/GROUP RED/ETSH/PLAYERS/KUZA.png' },
          { name: 'SNEAX', image: '/src/assets/GROUP STAGE/GROUP RED/ETSH/PLAYERS/SNEAX.png' },
        ]
      },
      {
        id: 'true-rippers',
        name: 'True Rippers',
        logo: trueRippersLogo,
        region: 'BMIC',
        qualifiedFrom: 'Direct Qualification',
        players: [
          { name: 'JELLY', image: '/src/assets/GROUP STAGE/GROUP RED/True Rippers/PLAYERS/JELLY.png' },
          { name: 'KIOLMAO', image: '/src/assets/GROUP STAGE/GROUP RED/True Rippers/PLAYERS/KIOLMAO.png' },
          { name: 'HARSH', image: '/src/assets/GROUP STAGE/GROUP RED/True Rippers/PLAYERS/HARSH.png' },
          { name: 'HYDRO', image: '/src/assets/GROUP STAGE/GROUP RED/True Rippers/PLAYERS/HYDRO.png' },

        ]
      },
      {
        id: 'weibo-gaming',
        name: 'Weibo Gaming',
        logo: weiboLogo,
        region: 'PEL',
        qualifiedFrom: 'PEL Points',
        players: [
          { name: 'SUKK', image: '/src/assets/GROUP STAGE/GROUP RED/Weibo Gaming/PLAYERS/SUKK.png' },
          { name: 'ORDER', image: '/src/assets/GROUP STAGE/GROUP RED/Weibo Gaming/PLAYERS/ORDER.png' },
          { name: '33Z', image: '/src/assets/GROUP STAGE/GROUP RED/Weibo Gaming/PLAYERS/33Z.png' },
          { name: 'HE', image: '/src/assets/GROUP STAGE/GROUP RED/Weibo Gaming/PLAYERS/HE.png' },
          { name: 'HUAI', image: '/src/assets/GROUP STAGE/GROUP RED/Weibo Gaming/PLAYERS/HUAI.png' },
          { name: 'HERO', image: '/src/assets/GROUP STAGE/GROUP RED/Weibo Gaming/PLAYERS/HERO.png' },
        ]
      },
      // Placeholders for Gauntlet qualifiers (5 teams - positions 8, 10, 11, 12, 14)
      {
        id: 'gauntlet-red-1',
        name: 'The Gauntlet #8',
        logo: '/placeholder-logo.png',
        region: 'TBD',
        qualifiedFrom: 'The Gauntlet',
        isPlaceholder: true,
        players: []
      },
      {
        id: 'gauntlet-red-2',
        name: 'The Gauntlet #10',
        logo: '/placeholder-logo.png',
        region: 'TBD',
        qualifiedFrom: 'The Gauntlet',
        isPlaceholder: true,
        players: []
      },
      {
        id: 'gauntlet-red-3',
        name: 'The Gauntlet #11',
        logo: '/placeholder-logo.png',
        region: 'TBD',
        qualifiedFrom: 'The Gauntlet',
        isPlaceholder: true,
        players: []
      },
      {
        id: 'gauntlet-red-4',
        name: 'The Gauntlet #12',
        logo: '/placeholder-logo.png',
        region: 'TBD',
        qualifiedFrom: 'The Gauntlet',
        isPlaceholder: true,
        players: []
      },
      {
        id: 'gauntlet-red-5',
        name: 'The Gauntlet #14',
        logo: '/placeholder-logo.png',
        region: 'TBD',
        qualifiedFrom: 'The Gauntlet',
        isPlaceholder: true,
        players: []
      }
    ]
  },

  lastChance: [
    // Placeholders for teams from Group Stage (4th-11th from both groups = 16 teams)
    { id: 'green-4', name: 'Group Green #4', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Green', isPlaceholder: true, players: [] },
    { id: 'green-5', name: 'Group Green #5', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Green', isPlaceholder: true, players: [] },
    { id: 'green-6', name: 'Group Green #6', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Green', isPlaceholder: true, players: [] },
    { id: 'green-7', name: 'Group Green #7', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Green', isPlaceholder: true, players: [] },
    { id: 'green-8', name: 'Group Green #8', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Green', isPlaceholder: true, players: [] },
    { id: 'green-9', name: 'Group Green #9', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Green', isPlaceholder: true, players: [] },
    { id: 'green-10', name: 'Group Green #10', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Green', isPlaceholder: true, players: [] },
    { id: 'green-11', name: 'Group Green #11', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Green', isPlaceholder: true, players: [] },
    { id: 'red-4', name: 'Group Red #4', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Red', isPlaceholder: true, players: [] },
    { id: 'red-5', name: 'Group Red #5', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Red', isPlaceholder: true, players: [] },
    { id: 'red-6', name: 'Group Red #6', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Red', isPlaceholder: true, players: [] },
    { id: 'red-7', name: 'Group Red #7', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Red', isPlaceholder: true, players: [] },
    { id: 'red-8', name: 'Group Red #8', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Red', isPlaceholder: true, players: [] },
    { id: 'red-9', name: 'Group Red #9', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Red', isPlaceholder: true, players: [] },
    { id: 'red-10', name: 'Group Red #10', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Red', isPlaceholder: true, players: [] },
    { id: 'red-11', name: 'Group Red #11', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Red', isPlaceholder: true, players: [] }
  ],

  grandFinals: [
    // From The Gauntlet (Top 7)
    { id: 'gauntlet-1', name: 'The Gauntlet #1', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'The Gauntlet', placement: '1st', isPlaceholder: true, players: [] },
    { id: 'gauntlet-2', name: 'The Gauntlet #2', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'The Gauntlet', placement: '2nd', isPlaceholder: true, players: [] },
    { id: 'gauntlet-3', name: 'The Gauntlet #3', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'The Gauntlet', placement: '3rd', isPlaceholder: true, players: [] },
    { id: 'gauntlet-4', name: 'The Gauntlet #4', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'The Gauntlet', placement: '4th', isPlaceholder: true, players: [] },
    { id: 'gauntlet-5', name: 'The Gauntlet #5', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'The Gauntlet', placement: '5th', isPlaceholder: true, players: [] },
    { id: 'gauntlet-6', name: 'The Gauntlet #6', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'The Gauntlet', placement: '6th', isPlaceholder: true, players: [] },
    { id: 'gauntlet-7', name: 'The Gauntlet #7', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'The Gauntlet', placement: '7th', isPlaceholder: true, players: [] },

    // From Group Stage (Top 3 from each group)
    { id: 'green-1', name: 'Group Green #1', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Green', placement: '1st', isPlaceholder: true, players: [] },
    { id: 'green-2', name: 'Group Green #2', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Green', placement: '2nd', isPlaceholder: true, players: [] },
    { id: 'green-3', name: 'Group Green #3', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Green', placement: '3rd', isPlaceholder: true, players: [] },
    { id: 'red-1', name: 'Group Red #1', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Red', placement: '1st', isPlaceholder: true, players: [] },
    { id: 'red-2', name: 'Group Red #2', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Red', placement: '2nd', isPlaceholder: true, players: [] },
    { id: 'red-3', name: 'Group Red #3', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Group Red', placement: '3rd', isPlaceholder: true, players: [] },

    // From Last Chance (Top 2)
    { id: 'lastchance-1', name: 'Last Chance #1', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Last Chance', placement: '1st', isPlaceholder: true, players: [] },
    { id: 'lastchance-2', name: 'Last Chance #2', logo: '/placeholder-logo.png', region: 'TBD', qualifiedFrom: 'Last Chance', placement: '2nd', isPlaceholder: true, players: [] },

    // Host Country Invitee
    {
      id: 'vampire-esports',
      name: 'Vampire Esports',
      logo: vampireLogo,
      region: 'Thailand 🇹🇭',
      qualifiedFrom: 'Host Country Invitee',
      placement: '16th',
      players: []
    }
  ]
};