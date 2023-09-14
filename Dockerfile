FROM node:14

ADD . /home/node/app
WORKDIR /home/node/app

RUN apt-get update && apt-get install -y openssh-server \
        python3 \
        python3-pip \
        git \
        jq && \
    pip3 install awscli && \
    pip3 install git-remote-codecommit

RUN mkdir -p /run/sshd /root/.aws /root/.ssh && \
    mv /home/node/app/.docker/docker-entrypoint.sh /usr/local/bin/ && \
    mv /home/node/app/.docker/dev_setup /usr/local/bin/ && \
    mv /home/node/app/.docker/aws_config /root/.aws/config && \
    rm -Rf /home/node/app/.docker

RUN sed -i -e 's/^#SyslogFacility\sAUTH/SyslogFacility AUTHPRIV/' \
        -e 's/^#PasswordAuthentication\syes/PasswordAuthentication no/' \
        -e 's/^#PermitRootLogin\sprohibit-password/PermitRootLogin without-password/' \
        -e 's/^X11Forwarding\syes/X11Forwarding no/' \
        -e 's/^#Compression\sdelayed/Compression delayed/' \
        -e 's/^#HostKey/HostKey/' /etc/ssh/sshd_config && \
    echo "Protocol 2" >> /etc/ssh/sshd_config && \
    echo "AuthenticationMethods publickey" >> /etc/ssh/sshd_config && \
    echo "AcceptEnv LANG LC_CTYPE LC_NUMERIC LC_TIME LC_COLLATE LC_MONETARY LC_MESSAGES" >> /etc/ssh/sshd_config && \
    echo "AcceptEnv LC_PAPER LC_NAME LC_ADDRESS LC_TELEPHONE LC_MEASUREMENT" >> /etc/ssh/sshd_config && \
    echo "AcceptEnv LC_IDENTIFICATION LC_ALL LANGUAGE" >> /etc/ssh/sshd_config && \
    echo "AcceptEnv XMODIFIERS" >> /etc/ssh/sshd_config && \
    echo "Ciphers aes256-ctr" >> /etc/ssh/sshd_config && \
    echo "KexAlgorithms diffie-hellman-group-exchange-sha256,ecdh-sha2-nistp256,ecdh-sha2-nistp384,ecdh-sha2-nistp521" >> /etc/ssh/sshd_config && \
    echo "MACs hmac-sha2-512,hmac-sha2-256" >> /etc/ssh/sshd_config

RUN npm install

RUN type -p curl >/dev/null || (apt update && apt install curl -y) \
    && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt update \
    && apt install gh -y

EXPOSE 22 8000

CMD ["/usr/sbin/sshd", "-D"]