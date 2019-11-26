pipeline {
    agent any
    environment {
        repo_path = '$(basename $PWD)'
    }
    stages {
        stage('sync source code') {
            when{ branch 'master' }
            steps {
                sh "rsync -rva ../${repo_path} ubuntu@10.20.1.216:/home/ubuntu/"
            }
        }
        stage('build') {
            when { branch 'master' }
            steps {
                sh "ssh ubuntu@10.20.1.216 'cd ~/'contently_master' ; mvn clean package -DskipTests'"
                sh "ssh ubuntu@10.20.1.216 'sudo docker rm -f contently-frontend'"
                sh "ssh ubuntu@10.20.1.216 'sudo docker rmi contently_contently-frontend'"
                sh "ssh ubuntu@10.20.1.216 'cd ~/'contently_master'/frontend ; npm install'"
                sh "ssh ubuntu@10.20.1.216 'cd ~/'contently_master'/frontend ; ng build'"
            }
        }
        stage('Deploy') {
            when { branch 'master' }
            steps {
                sh  "ssh ubuntu@10.20.1.216 'cd ~/'contently_master' ; sudo docker-compose up --build -d'"
            }
        }
        stage('Deployment status') {
            when { branch 'master' }
            steps {
                 sh "ssh ubuntu@10.20.1.216 'cd ~/'contently_master' ; sleep 30 ; sudo docker ps'"
            }
        }
    }
}
