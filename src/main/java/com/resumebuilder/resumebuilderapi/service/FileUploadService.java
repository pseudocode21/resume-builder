package com.resumebuilder.resumebuilderapi.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.resumebuilder.resumebuilderapi.document.Resume;
import com.resumebuilder.resumebuilderapi.dto.AuthResponse;
import com.resumebuilder.resumebuilderapi.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final Cloudinary cloudinary;
    private final AuthService authService;
    private final ResumeRepository resumeRepository;

    public Map<String, String> uploadSingleImage(MultipartFile file) throws IOException {
        Map<String, Object> imageUploadResults = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("resource_type", "image"));
        log.info("Inside FileUploadService - uploadSingleImage() {}",imageUploadResults.get("secure_url").toString());
        return Map.of("imageUrl", imageUploadResults.get("secure_url").toString());
    }

    public Map<String, String> uploadResumeImages(String resumeId, @Nullable Object principal, MultipartFile thumbnail, MultipartFile profileImage) throws IOException {
        //Step 1: Get the user Profile
        AuthResponse response = authService.getProfile(principal);
        //Step 2: Get the existing Resume
        Resume existingResume = resumeRepository.findByUserIdAndId(response.getId(), resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not Found "));
        //Step 3: Upload the resume images and set the resume
        Map<String, String> returnValue = new HashMap<>();
        Map<String, String> uploadResult;
        if (Objects.nonNull(thumbnail)) {
            uploadResult = uploadSingleImage(thumbnail);
            existingResume.setThumbnailLink(uploadResult.get("imageUrl"));
            returnValue.put("thumbnailLink", uploadResult.get("imageUrl"));
        }
        if (Objects.nonNull(profileImage)) {
            uploadResult = uploadSingleImage(profileImage);
            if(Objects.isNull(existingResume.getProfileInfo())){
                existingResume.setProfileInfo(new Resume.ProfileInfo());
            }
            existingResume.getProfileInfo().setProfilePreviewUrl(uploadResult.get("imageUrl"));
            returnValue.put("profilePreviewUrl", uploadResult.get("imageUrl"));
        }

        //Step 4: update the details into database
        resumeRepository.save(existingResume);
        returnValue.put("message", "Image Uploaded Successfully");

        //Step 5: Return the result
        return returnValue;
    }

}
