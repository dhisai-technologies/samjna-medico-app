pipeline {
    agent any

    environment {
        SSH_CREDENTIALS_ID = 'samjna-ec2'
        VPS_HOST = 'ec2-user@ec2-13-127-140-125.ap-south-1.compute.amazonaws.com'
        WORKDIR = '~/samjna'
        CONFIG_REPO_URL = 'git@github.com:/dhisai-technologies/config.git'
        CONFIG_FILE_PATH = 'samjna-medico-app/docker-compose.yml'
    }

    stages {
        stage('Connect to VPS via SSH') {
            steps {
                script {
                    // Using the SSH Agent plugin
                    sshagent([env.SSH_CREDENTIALS_ID]) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${env.VPS_HOST} '
                                cd samjna && \
                                git pull origin main && \
                                git clone ${env.CONFIG_REPO_URL} /tmp/config-repo && \
                                cp /tmp/config-repo/${env.CONFIG_FILE_PATH} ${env.WORKDIR}/docker-compose.yml && \
                                rm -rf /tmp/config-repo && \
                                docker compose up -d
                                rm -rf ${env.WORKDIR}/docker-compose.yml
                            '
                        """
                    }
                }
            }
        }
    }
}