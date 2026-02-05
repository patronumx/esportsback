const express = require('express');
const router = express.Router();
const teamController = require('../../controllers/teamController');
const playerController = require('../../controllers/playerController');
const { auth, authorize } = require('../../middleware/auth');
const logAction = require('../../middleware/auditLogger');

// Team Management
router.post('/create', auth, authorize('super-admin', 'admin'), logAction('CREATE', 'Team'), teamController.createTeam);
router.put('/:teamId/update', auth, authorize('super-admin', 'admin'), logAction('UPDATE', 'Team'), teamController.updateTeam);
router.delete('/:teamId/delete', auth, authorize('super-admin'), logAction('DELETE', 'Team'), teamController.deleteTeam);
router.get('/', auth, teamController.getTeams);

// Player Management
router.post('/:teamId/player/add', auth, authorize('super-admin', 'admin'), logAction('ADD_PLAYER', 'Team'), teamController.addPlayer);
router.put('/player/:playerId/update', auth, authorize('super-admin', 'admin'), logAction('UPDATE_PLAYER', 'Player'), playerController.updatePlayer);
router.delete('/player/:playerId/delete', auth, authorize('super-admin', 'admin'), logAction('DELETE_PLAYER', 'Player'), playerController.deletePlayer);
router.get('/players', auth, playerController.getPlayers);

module.exports = router;
