package com.campusconnect.controller;

import com.campusconnect.dto.CommunityCommentDto;
import com.campusconnect.dto.CommunityPostDto;
import com.campusconnect.service.CommunityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community")
public class CommunityController {

    @Autowired
    private CommunityService communityService;

    @GetMapping("/posts")
    public ResponseEntity<List<CommunityPostDto>> getAllPosts() {
        return ResponseEntity.ok(communityService.getAllPosts());
    }

    @PostMapping("/posts")
    public ResponseEntity<CommunityPostDto> createPost(@Valid @RequestBody CommunityPostDto postDto, Authentication authentication) {
        CommunityPostDto created = communityService.createPost(postDto, authentication.getName());
        return ResponseEntity.ok(created);
    }
    
    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<CommunityCommentDto> addComment(@PathVariable Long id, @Valid @RequestBody CommunityCommentDto commentDto, Authentication authentication) {
        CommunityCommentDto created = communityService.addComment(id, commentDto, authentication.getName());
        return ResponseEntity.ok(created);
    }
}
