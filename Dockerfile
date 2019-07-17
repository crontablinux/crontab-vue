# Each instruction creates a new layer of the image.
FROM ubuntu:16.04

WORKDIR /ops/crontab-vue
COPY . .
ENV LANG='C.UTF-8' LC_ALL='C.UTF-8' TZ='Asia/Shanghai'
RUN printf "nameserver 8.8.8.8\nnameserver 8.8.4.4\nnameserver 114.114.114.114\n" > /etc/resolv.conf \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
    && sed -i s@archive.ubuntu.com@mirrors.aliyun.com@g /etc/apt/sources.list \
    && sed -i s@us.archive.ubuntu.com@mirrors.aliyun.com@g /etc/apt/sources.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh \
    && bash nodesource_setup.sh \
    && apt install nodejs \
    && npm cache clean --force \
    && npm install \
    && apt-get -y install $(cat requirements/deb_requirements.txt) \
    && apt-get -y -o Dpkg::Options::="--force-confmiss" install --reinstall netbase \
    && apt-get purge --auto-remove -y \
    && apt-get autoclean -y \
    && rm -rf /var/lib/apt/lists/*

# RUN python3 manage.py makemigrations
# RUN python3 manage.py migrate
# RUN python3 createsuperuser.py

EXPOSE 8080
VOLUME /ops/crontab-vue
CMD ["/usr/bin/npm", "run", "serve:no-mock"]