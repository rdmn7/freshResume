#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration template
const configTemplate = {
  site: {
    title: "",
    name: "",
    role: "",
    bio: "",
    company: {
      name: "",
      kvk: "",
      btw: ""
    },
    contact: {
      email: "",
      phone: ""
    },
    social: {
      linkedin: "",
      github: "",
      certifications: ""
    },
    colorScheme: {
      primary: "#0078D4",
      secondary: "#7B42BC",
      accent: "#FF6600"
    },
    animations: {
      textScramble: true,
      enabled: true
    },
    openToWork: {
      enabled: true,
      status: "open",
      text: "Open to Work",
      colors: {
        open: "#1DBF73",
        busy: "#E74C3C",
        notAvailable: "#95A5A6"
      }
    },
    sections: {
      header: true,
      about: true,
      skills: true,
      technicalSkills: true,
      experience: true,
      education: true,
      certifications: true,
      languages: true,
      contact: true
    }
  },
  scramble: {
    enabled: true,
    phrases: [
      "Software Engineer",
      "Web Developer",
      "UX Designer",
      "Product Manager",
      "Tech Enthusiast"
    ],
    delay: 2000
  }
};

console.log("🚀 Fresh Resume Theme Setup");
console.log("============================");
console.log("Let's set up your resume with some basic information.\n");

// Ask questions and populate the config
rl.question("What's your full name? ", (name) => {
  configTemplate.site.name = name;
  
  rl.question("What's your professional role/title? ", (role) => {
    configTemplate.site.role = role;
    configTemplate.site.title = `${name} | ${role}`;
    
    rl.question("Write a brief bio (1-2 sentences): ", (bio) => {
      configTemplate.site.bio = bio;
      
      rl.question("Your company/organization name: ", (company) => {
        configTemplate.site.company.name = company;
        
        rl.question("LinkedIn URL (optional): ", (linkedin) => {
          if (linkedin) configTemplate.site.social.linkedin = linkedin;
          
          rl.question("GitHub URL (optional): ", (github) => {
            if (github) configTemplate.site.social.github = github;
            
            rl.question("Email address (for contact form): ", (email) => {
              configTemplate.site.contact.email = email;
              
              rl.question("Are you open to work? (yes/no/busy): ", (openToWork) => {
                if (openToWork.toLowerCase() === 'yes') {
                  configTemplate.site.openToWork.enabled = true;
                  configTemplate.site.openToWork.status = "open";
                  configTemplate.site.openToWork.text = "Open to Work";
                } else if (openToWork.toLowerCase() === 'busy') {
                  configTemplate.site.openToWork.enabled = true;
                  configTemplate.site.openToWork.status = "busy";
                  configTemplate.site.openToWork.text = "Currently Busy";
                } else {
                  configTemplate.site.openToWork.enabled = false;
                }
                
                // Save the configuration
                saveConfiguration(configTemplate);
                rl.close();
              });
            });
          });
        });
      });
    });
  });
});

function saveConfiguration(config) {
  // Create data directory if it doesn't exist
  const dataDir = path.join(__dirname, 'src', '_data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Save site.json
  fs.writeFileSync(
    path.join(dataDir, 'site.json'),
    JSON.stringify(config.site, null, 2)
  );
  
  // Save scramble.json
  fs.writeFileSync(
    path.join(dataDir, 'scramble.json'),
    JSON.stringify(config.scramble, null, 2)
  );
  
  console.log("\n✅ Configuration saved successfully!");
  console.log("\nNext steps:");
  console.log("1. Run 'npm install' to install dependencies");
  console.log("2. Run 'npm start' to start the development server");
  console.log("3. Open http://localhost:8080 in your browser");
  console.log("\nYou can further customize your resume by editing the JSON files in the src/_data directory.");
} 