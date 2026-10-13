package com.campusconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponse {
    private String accessToken;
    
    @Builder.Default
    private String tokenType = "Bearer";
    
    private String role;
    private String fullName;
    
    public AuthResponse(String accessToken) {
        this.accessToken = accessToken;
        this.tokenType = "Bearer";
    }
}
