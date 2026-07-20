---
title: nginx 配置反向代理并开启 https
date: 2026-07-20 11:43:25
tags: ['nginx', 'https', '反向代理', '教程']
categories: ['服务器']
---

# 1. 正确安装 nginx 并配置好 ssl 模块

- 已经安装的情况下

```bash
# 检查版本是否包含 configure arguments: ... --with-http_ssl_module ...
nginx -V
```

如果 包含 `--with-http_ssl_module`，但仍提示错误，可能是配置文件的路径或格式有问题，请仔细检查配置文件。

如果 不包含，则需要重新安装或重新编译 Nginx 以支持 SSL。

- 这里采用从源码编译安装添加 `--with-http_ssl_module`

1. 下载源码

```bash
wget http://nginx.org/download/nginx-1.x.x.tar.gz
tar -zxvf nginx-1.x.x.tar.gz
cd nginx-1.x.x
```

2. 编译时启用 SSL 模块：

```bash
./configure --with-http_ssl_module
make
sudo make install
```

3. 把 `/usr/local/nginx/sbin/nginx` 可以软连接到 `/usr/local/bin` 中，这样全局可以执行

4. 启动新版本的 Nginx 并检查是否支持 SSL：

```bash
nginx -V
```

5. 让 `nginx` 开机自启

使用 `systemd` 设置 `Nginx` 开机启动（推荐）
创建或检查 `Nginx` 的 `systemd` 服务文件
`Nginx` 的 `systemd` 服务文件通常位于 `/etc/systemd/system/nginx.service` 或 `/lib/systemd/system/nginx.service`。你可以检查是否已存在该文件。

使用以下命令查看文件：

```bash
sudo systemctl status nginx
```

如果返回结果中包含 `nginx.service`，说明 `systemd` 已经为 `Nginx` 配置了服务文件。

如果没有服务文件，手动创建服务文件
如果 `Nginx` 的 `systemd` 服务文件不存在，你可以手动创建一个。首先，创建或编辑 `nginx.service` 文件：

```bash
sudo vi /etc/systemd/system/nginx.service
```

添加以下内容到 `nginx.service` 文件：

```ini
[Unit]
Description=The nginx HTTP and reverse proxy server
After=network.target

[Service]
Type=forking
ExecStart=/usr/local/nginx/sbin/nginx
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s stop
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

其中：

`ExecStart` 是 `Nginx` 启动的命令路径。
`ExecReload` 用于重新加载配置。
`ExecStop` 用于停止 `Nginx`。
重新加载 `systemd` 配置：

```bash
sudo systemctl daemon-reload
```

启用 `Nginx` 自启动：
现在，启用 `Nginx` 在系统启动时自动启动：

```bash
sudo systemctl enable nginx
```

这会将 `Nginx` 服务加入到系统的启动项中。

```bash
sudo systemctl start nginx
```

使用以下命令检查 `Nginx` 服务是否正在运行：

```bash
sudo systemctl status nginx
```

# 3. 给域名申请证书

这里使用 `Let's Encrypt` 免费证书为例子
安装 `certbot`

```bash
sudo yum install -y epel-release
sudo yum install -y certbot python3-certbot-nginx
```

因为没有装 `nginx` 插件，这里采用不通过插件的方式生成证书

**需要先停止 `nginx` 服务**

```bash
sudo certbot certonly --standalone -d your.domain.com
```
如果生成成功，证书将位于 `/etc/letsencrypt/live/your.domain.com/` 中。


# 2. 添加反向代理配置

这里我把配置文件都放到一个文件夹里，通过 `nginx` 主配置进行引入

```bash
sudo mkdir -p /mnt/nginx/conf
sudo nano /mnt/nginx/conf/reverse_proxy.conf
```

在文件中添加以下内容，以当前域名为例子 `your.domain.com`：

```nginx
server {
    # 这里是绑定默认的 https 的端口，后面一定要加 ssl
    listen 443 ssl;
    # 这里写绑定好的域名
    server_name your.domain.com;

    # 这里放置证书的路径
    ssl_certificate /etc/letsencrypt/live/your.domain.com/fullchain.pem; # 
    ssl_certificate_key /etc/letsencrypt/live/your.domain.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8443;  # 将请求代理到内部的端口
        proxy_http_version 1.1; # 确保支持 HTTP/1.1，这是 WebSocket 所需的。
        proxy_set_header Upgrade $http_upgrade; # 用于处理 WebSocket 升级。
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

- 不需要 `https` 的配置如下

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:8443;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

```

# 3. 证书定时续期

`Let's Encrypt` 的证书有效期为 `90` 天，`Certbot` 可以自动续期。运行以下命令测试续期是否正常：

```bash
# 测试证书续期是否正常
sudo certbot renew --dry-run
# 证书续期
sudo certbot renew
```
**需要先关闭 `nginx` 占用的 `80` 端口**

如果测试成功，`Certbot` 会自动通过 `cron` 或 `systemd` 定期续期，无需额外操作。

