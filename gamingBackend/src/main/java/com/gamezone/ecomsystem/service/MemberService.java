package com.gamezone.ecomsystem.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.gamezone.ecomsystem.dto.GameDto;
import com.gamezone.ecomsystem.dto.MemberProfileDto;
import com.gamezone.ecomsystem.dto.PlayedHistoryDto;
import com.gamezone.ecomsystem.dto.RechargeDto;
import com.gamezone.ecomsystem.exception.BusinessException;
import com.gamezone.ecomsystem.exception.ResourceNotFoundException;
import com.gamezone.ecomsystem.mapper.GameMapper;
import com.gamezone.ecomsystem.mapper.MemberMapper;
import com.gamezone.ecomsystem.mapper.RechargeMapper;
import com.gamezone.ecomsystem.model.Game;
import com.gamezone.ecomsystem.model.Member;
import com.gamezone.ecomsystem.model.Recharge;
import com.gamezone.ecomsystem.model.Transaction;
import com.gamezone.ecomsystem.repository.GameRepository;
import com.gamezone.ecomsystem.repository.MemberRepository;
import com.gamezone.ecomsystem.repository.RechargeRepository;
import com.gamezone.ecomsystem.repository.TransactionRepository;

@Service
public class MemberService {
    private static final Logger log = LoggerFactory.getLogger(MemberService.class);

    @Autowired
    private MemberRepository repo;

    public Member create(Member member) {
        log.info("Creating member: {}", member.getName());
        member.setId(null);
        validate(member);
        return repo.save(member);
    }

    public List<Member> findAll() {
        log.info("Finding all members");
        return repo.findAll();
    }

    public Member findById(String id) {
        log.info("Finding member by id: {}", id);
        return repo.findById(id)
                .orElseThrow(() -> {
                    log.error("Attempted to find non-existing member id: {}", id);
                    return new ResourceNotFoundException("Member not found with id: " + id);
                });
    }

    public Member update(String id, Member memberDetails) {
        log.info("Updating member by id: {}", id);
        Member existingMember = findById(id); // This already handles the not-found case

        existingMember.setName(memberDetails.getName());
        existingMember.setPhoneNumber(memberDetails.getPhoneNumber());
        existingMember.setEmail(memberDetails.getEmail());
        existingMember.setBalance(memberDetails.getBalance());
        existingMember.setActive(memberDetails.isActive());

        validate(existingMember);
        return repo.save(existingMember);
    }

    public void delete(String id) {
        log.info("Deleting member by id: {}", id);
        if (!repo.existsById(id)) {
            log.error("Attempted to delete non-existing member id: {}", id);
            throw new ResourceNotFoundException("Member not found with id: " + id);
        }
        repo.deleteById(id);
    }

    private void validate(Member member) {
        if (!StringUtils.hasText(member.getName())) {
            throw new BusinessException("Member name cannot be empty.");
        }
        if (member.getBalance() < 0) {
            throw new BusinessException("Balance cannot be negative.");
        }
        if (member.getPhoneNumber() == null || member.getPhoneNumber().length() != 10) {
            throw new BusinessException("Phone number must be 10 digits.");
        }
    }
   
	 // Add these at the top with your other @Autowired fields
	 @Autowired private RechargeRepository rechargeRepo;
	 @Autowired private GameRepository gameRepo;
	 @Autowired private TransactionRepository transactionRepo;
	
	 public MemberProfileDto getMemberProfileByPhone(String phoneNumber) {
	     // 1. Find the Member
	     Member member = repo.findByPhoneNumber(phoneNumber)
	             .orElseThrow(() -> new ResourceNotFoundException("Member not found with phone: " + phoneNumber));
	
	     // 2. Get recharge history
	     List<Recharge> recharges = rechargeRepo.findByMemberId(member.getId());
	     List<RechargeDto> rechargeDtos = recharges.stream().map(RechargeMapper::toDto).collect(java.util.stream.Collectors.toList());
	
	     // 3. Get all available games
	     List<Game> activeGames = gameRepo.findByStatus("active");
	     List<GameDto> gameDtos = activeGames.stream().map(GameMapper::toDto).collect(java.util.stream.Collectors.toList());
	
	     // 4. Get played history (transactions)
	     List<Transaction> transactions = transactionRepo.findByMemberId(member.getId());
	     List<PlayedHistoryDto> playedHistoryDtos = transactions.stream().map(transaction -> {
	         PlayedHistoryDto dto = new PlayedHistoryDto();
	         dto.setId(transaction.getId());
	         dto.setDate_time(transaction.getDate());
	         dto.setAmount(transaction.getAmount());
	         gameRepo.findById(transaction.getGameId()).ifPresent(game -> dto.setGame_name(game.getName()));
	         return dto;
	     }).collect(java.util.stream.Collectors.toList());
	
	     // 5. Assemble the final profile
	     MemberProfileDto profile = new MemberProfileDto();
	     profile.setMember(MemberMapper.toDto(member));
	     profile.setRecharge_history(rechargeDtos);
	     profile.setGames(gameDtos);
	     profile.setPlayed_history(playedHistoryDtos);
	
	     return profile;
	 }
}