package com.gamezone.ecomsystem.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.gamezone.ecomsystem.model.Member;

public interface MemberRepository extends MongoRepository<Member, String> {
	Optional<Member> findByPhoneNumber(String phoneNumber); 
}