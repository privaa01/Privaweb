#include <sys/resource.h>
#include <sys/wait.h>
#include <libproc.h>
#include <signal.h>
#include <unistd.h>
#include <time.h>
#include <stdlib.h>
static volatile sig_atomic_t interrupted=0;
static void interrupt(int signal){(void)signal;interrupted=1;}

/* Local Darwin equivalent: measured physical footprint, not Linux RLIMIT_AS. */
int main(int argc,char **argv) {
 if(argc<2)return 125;
 struct timespec began;clock_gettime(CLOCK_MONOTONIC,&began);
 pid_t parent=getppid();
 signal(SIGTERM,interrupt);signal(SIGINT,interrupt);
 pid_t child=fork();
 if(child<0)return 125;
 if(child==0){
  signal(SIGTERM,SIG_DFL);signal(SIGINT,SIG_DFL);
  struct rlimit cpu={20,21},files={32,32},core={0,0};
  if(setrlimit(RLIMIT_CPU,&cpu)||setrlimit(RLIMIT_NOFILE,&files)||setrlimit(RLIMIT_CORE,&core))_exit(125);
  execv(argv[1],argv+1);_exit(125);
 }
 int status;
 for(;;){
  struct timespec now;clock_gettime(CLOCK_MONOTONIC,&now);
  if(interrupted||getppid()!=parent||now.tv_sec-began.tv_sec>=30){kill(child,SIGKILL);waitpid(child,&status,0);return 137;}
  pid_t result=waitpid(child,&status,WNOHANG);
  if(result==child)return WIFEXITED(status)?WEXITSTATUS(status):128+WTERMSIG(status);
  if(result<0){kill(child,SIGKILL);return 125;}
  struct rusage_info_v2 usage;
  if(proc_pid_rusage(child,RUSAGE_INFO_V2,(rusage_info_t*)&usage)==0){
   if(usage.ri_phys_footprint>536870912ULL){kill(child,SIGKILL);waitpid(child,&status,0);return 137;}
  }else{
   /* A process may exit between waitpid and sampling; never ignore other failures. */
   if(waitpid(child,&status,WNOHANG)==child)return WIFEXITED(status)?WEXITSTATUS(status):128+WTERMSIG(status);
   kill(child,SIGKILL);waitpid(child,&status,0);return 125;
  }
  struct timespec interval={0,5000000};nanosleep(&interval,0);
 }
}
