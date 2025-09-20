package com.gamezone.ecomsystem.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gamezone.ecomsystem.exception.BusinessException;
import com.gamezone.ecomsystem.exception.ResourceNotFoundException;
import com.gamezone.ecomsystem.model.Game;
import com.gamezone.ecomsystem.repository.GameRepository;

import java.util.List;

@Service
public class GameService {
    private static final Logger log = LoggerFactory.getLogger(GameService.class);

    @Autowired
    private GameRepository repo;

    public Game create(Game game) {
        log.info("Creating game: {}", game.getName());
        game.setId(null);
        validate(game);
        return repo.save(game);
    }

    public List<Game> findAll() {
        log.info("Finding all games");
        return repo.findAll();
    }

    public Game findById(String id) {
        log.info("Finding game by id: {}", id);
        return repo.findById(id)
                .orElseThrow(() -> {
                    log.error("Attempted to find non-existing game id: {}", id);
                    return new ResourceNotFoundException("Game not found with id: " + id);
                });
    }

    public Game update(String id, Game gameDetails) {
        log.info("Updating game by id: {}", id);
        Game existingGame = findById(id);

        existingGame.setName(gameDetails.getName());
        existingGame.setDescription(gameDetails.getDescription());
        existingGame.setPrice(gameDetails.getPrice());
        existingGame.setGenre(gameDetails.getGenre());
        existingGame.setStatus(gameDetails.getStatus());

        validate(existingGame);
        return repo.save(existingGame);
    }

    public void delete(String id) {
        log.info("Deleting game by id: {}", id);
        if (!repo.existsById(id)) {
            log.error("Attempted to delete non-existing game id: {}", id);
            throw new ResourceNotFoundException("Game not found with id: " + id);
        }
        repo.deleteById(id);
    }

    private void validate(Game game) {
        if (game.getPrice() < 0) {
            throw new BusinessException("Price cannot be negative.");
        }
    }
}