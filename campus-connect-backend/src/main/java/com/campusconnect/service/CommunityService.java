package com.campusconnect.service;

import com.campusconnect.dto.CommunityCommentDto;
import com.campusconnect.dto.CommunityPostDto;
import com.campusconnect.entity.CommunityComment;
import com.campusconnect.entity.CommunityPost;
import com.campusconnect.entity.User;
import com.campusconnect.enums.PublicationStatus;
import com.campusconnect.repository.CommunityCommentRepository;
import com.campusconnect.repository.CommunityPostRepository;
import com.campusconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommunityService {

    @Autowired
    private CommunityPostRepository postRepository;
    
    @Autowired
    private CommunityCommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    public List<CommunityPostDto> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapPostToDto)
                .collect(Collectors.toList());
    }

    public CommunityPostDto createPost(CommunityPostDto dto, String authorEmail) {
        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new RuntimeException("Author not found"));

        CommunityPost post = CommunityPost.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .author(author)
                .publicationStatus(PublicationStatus.PUBLISHED)
                .build();

        return mapPostToDto(postRepository.save(post));
    }
    
    public CommunityCommentDto addComment(Long postId, CommunityCommentDto dto, String authorEmail) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
                
        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new RuntimeException("Author not found"));

        CommunityComment comment = CommunityComment.builder()
                .content(dto.getContent())
                .post(post)
                .author(author)
                .build();

        return mapCommentToDto(commentRepository.save(comment));
    }

    private CommunityPostDto mapPostToDto(CommunityPost post) {
        CommunityPostDto dto = new CommunityPostDto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setAuthorName(post.getAuthor().getFullName());
        dto.setPublicationStatus(post.getPublicationStatus());
        dto.setCreatedAt(post.getCreatedAt().toString());
        
        List<CommunityCommentDto> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(post.getId())
                .stream()
                .map(this::mapCommentToDto)
                .collect(Collectors.toList());
                
        dto.setComments(comments);
        return dto;
    }
    
    private CommunityCommentDto mapCommentToDto(CommunityComment comment) {
        CommunityCommentDto dto = new CommunityCommentDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setAuthorName(comment.getAuthor().getFullName());
        dto.setCreatedAt(comment.getCreatedAt().toString());
        return dto;
    }
}
