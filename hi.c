 #include <stdio.h>
 int  square( int  n){
     return n * n;
 }
int main() {
       int  num;
          printf("Enter an  interger:");
           scanf("%d",  &num);
             square(num);
               printf("The square of %d is %d\n", num, square(num));


     

    return 0;
}
