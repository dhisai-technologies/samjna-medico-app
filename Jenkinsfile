pipeline {
    agent any

    environment {
        SSH_CREDENTIALS_ID = 'samjna-ec2'
        VPS_HOST = 'ec2-user@ec2-13-127-140-125.ap-south-1.compute.amazonaws.com'
        APP_REPO_URL = 'git@github.com:/dhisai-technologies/samjna-medico-app.git'
        APP_DIR = '/tmp/app-dir'
        CONFIG_REPO_URL = 'git@github.com:/dhisai-technologies/config.git'
        CONFIG_DIR = '/tmp/config-dir'
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
                                git clone ${env.APP_REPO_URL} ${env.APP_DIR} && \
                                git clone ${env.CONFIG_REPO_URL} ${env.CONFIG_DIR} && \
                                cp ${env.CONFIG_DIR}/${env.CONFIG_FILE_PATH} ${env.APP_DIR}/docker-compose.yml && \
                                rm -rf ${env.CONFIG_DIR} && \
                                cd ${env.APP_DIR} && \
                                docker compose up -d && \
                                rm -rf ${env.APP_DIR}
                            '
                        """
                    }
                }
            }
        }
    }
}