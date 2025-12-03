package com.bank.dormant.security;

import com.bank.dormant.model.Role;
import com.bank.dormant.model.User;
import com.bank.dormant.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

/**
 * JWT Authentication Filter
 * Intercepts requests, validates JWT tokens, and sets security context
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // Extract JWT token from Authorization header
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                username = jwtUtil.getUsernameFromToken(token);
            } catch (Exception e) {
                // Invalid token format or expired
                logger.warn("Failed to extract username from token: " + e.getMessage());
            }
        }
        
        // Validate token and set security context
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(token)) {
                // Load user from database
                Optional<User> userOptional = userRepository.findByUsername(username);
                
                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    
                    // Check if user is active
                    if (user.getActive()) {
                        // Extract role from token
                        String roleFromToken = jwtUtil.getRoleFromToken(token);
                        Role role = Role.valueOf(roleFromToken);
                        
                        // Create authentication token with role
                        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role.name());
                        UsernamePasswordAuthenticationToken authToken = 
                            new UsernamePasswordAuthenticationToken(
                                user, 
                                null, 
                                Collections.singletonList(authority)
                            );
                        
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        
                        // Set authentication in security context
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
