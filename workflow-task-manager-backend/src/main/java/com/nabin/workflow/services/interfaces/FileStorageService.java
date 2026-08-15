package com.nabin.workflow.services.interfaces;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String storeFile(MultipartFile file, Long taskId);
    Resource loadFileAsResource(String fileName);
    void deleteFile(String fileName);
    void init();
}