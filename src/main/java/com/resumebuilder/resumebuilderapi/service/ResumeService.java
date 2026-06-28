package com.resumebuilder.resumebuilderapi.service;

import com.resumebuilder.resumebuilderapi.document.Resume;
import com.resumebuilder.resumebuilderapi.dto.AuthResponse;
import com.resumebuilder.resumebuilderapi.dto.CreateResumeRequest;
import com.resumebuilder.resumebuilderapi.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

    private final ResumeRepository resumeRespository;
    private final AuthService authService;


    public Resume createResume(CreateResumeRequest request, Object principalObject) {
        //Step 1: Create resume object
        Resume newResume = new Resume();

        //Step 2: Get the current profile
        AuthResponse response = authService.getProfile(principalObject);

        //Step 3: update the resume object
        newResume.setUserId(response.getId());
        newResume.setTitle(request.getTitle());

        //Step 4: Set the default data for resume
        setDefaultResumeData(newResume);

        //Step 5: save the resume data
        return resumeRespository.save(newResume);
    }

    private void setDefaultResumeData(Resume newResume) {
        newResume.setProfileInfo(new Resume.ProfileInfo());
        newResume.setContactInfo(new Resume.ContactInfo());
        newResume.setWorkExperience(new ArrayList<>());
        newResume.setEducation(new ArrayList<>());
        newResume.setSkills(new ArrayList<>());
        newResume.setProjects(new ArrayList<>());
        newResume.setCertifications(new ArrayList<>());
        newResume.setLanguages(new ArrayList<>());
        newResume.setInterests(new ArrayList<>());

    }

    public List<Resume> getUserResumes(@Nullable Object principal) {
        //Step 1: Get the current Profile
        AuthResponse response = authService.getProfile(principal);

        //Step 2: Call the repository finder method
        List<Resume> resumes = resumeRespository.findByUserIdOrderByUpdatedAtDesc(response.getId());

        //Step 3: return result
        return resumes;
    }


    public Resume getResumeById(String resumeId, Object principal) {
        //Step 1: Get the current Profile
        AuthResponse response = authService.getProfile(principal);

        //Step 2: Call the repo finder method
        Resume existingResume = resumeRespository.findByUserIdAndId(response.getId(), resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found "));

        //Step3: return result
        return existingResume;
    }

    public Resume updateResume(String resumeId, Resume updatedData, @Nullable Object principal) {
        //Step 1: Get the current Profile
        AuthResponse response = authService.getProfile(principal);
        //Step 2: Call the repo finder method
        Resume existingResume = resumeRespository.findByUserIdAndId(response.getId(), resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found "));

        //Step 3: update the new data
        existingResume.setTitle(updatedData.getTitle());
        existingResume.setThumbnailLink(updatedData.getThumbnailLink());
        existingResume.setTemplate(updatedData.getTemplate());
        existingResume.setProfileInfo(updatedData.getProfileInfo());
        existingResume.setContactInfo(updatedData.getContactInfo());
        existingResume.setWorkExperience(updatedData.getWorkExperience());
        existingResume.setEducation(updatedData.getEducation());
        existingResume.setSkills(updatedData.getSkills());
        existingResume.setProjects(updatedData.getProjects());
        existingResume.setCertifications(updatedData.getCertifications());
        existingResume.setLanguages(updatedData.getLanguages());
        existingResume.setInterests(updatedData.getInterests());

        //Step 4: Save the data
        resumeRespository.save(existingResume);

        //Step 5: return result
        return existingResume;
    }

    public void deleteResume(String resumeId, @Nullable Object principal) {
        //Step 1: Get the current Profile
        AuthResponse response = authService.getProfile(principal);

        //Step 2: Call the repo finder method
        Resume existingResume = resumeRespository.findByUserIdAndId(response.getId(), resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        //Delete the resume
        resumeRespository.delete(existingResume);

    }
}
