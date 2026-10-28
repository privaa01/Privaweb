#include <sys/resource.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include <stdio.h>

int main(int argc,char **argv){
 assert(argc>=2);
 if(strcmp(argv[1],"cpu")==0){volatile unsigned long n=0;for(;;)n++;}
 if(strcmp(argv[1],"memory")==0){
  volatile unsigned char *p=malloc(1024UL*1024*1024);assert(p);
  for(size_t i=0;i<1024UL*1024*1024;i+=4096)p[i]=1;
  sleep(2);return 10; /* Must be killed, never accepted as a successful check. */
 }
 assert(argc==5);
 struct rlimit limit;
 assert(getrlimit(RLIMIT_CPU,&limit)==0&&limit.rlim_cur==20&&limit.rlim_max==21);
 assert(getrlimit(RLIMIT_NOFILE,&limit)==0&&limit.rlim_cur==32&&limit.rlim_max==32);
 assert(getrlimit(RLIMIT_CORE,&limit)==0&&limit.rlim_cur==0&&limit.rlim_max==0);
 int fd=open(argv[2],O_RDONLY);assert(fd>=0);close(fd);
 assert(open(argv[3],O_RDONLY)==-1&&(errno==EPERM||errno==EACCES));
 assert(open(argv[2],O_WRONLY)==-1&&(errno==EPERM||errno==EACCES));
 assert(open(argv[4],O_CREAT|O_WRONLY,0600)==-1&&(errno==EPERM||errno==EACCES));
 int sock=socket(AF_INET,SOCK_STREAM,0);
 if(sock>=0){
  struct sockaddr_in address={0};address.sin_family=AF_INET;address.sin_port=htons(9);address.sin_addr.s_addr=htonl(INADDR_LOOPBACK);
  assert(connect(sock,(struct sockaddr*)&address,sizeof(address))==-1&&(errno==EPERM||errno==EACCES));close(sock);
 }else assert(errno==EPERM||errno==EACCES);
 assert(fork()==-1&&(errno==EPERM||errno==EACCES));
 puts("policy-denials-verified");return 0;
}
