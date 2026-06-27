/**  
   Indexed DB를 사용함으로써 용량이 큰걸 효과적으로 대응함
   하지만, Indexed DB는 Internet Explore 11 에서 작동하지 않는다는 사실을 발견

   InternetExplore11에서 같은 기능을 손쉽게 수정하기 위해 이 구조를 적용함. 

   하지만 촉박한 기간에 기능 개발이 우선이여서 LocalDBRepository.tsx 는
   같은 기능 개발을 생략함. 
   
   IRepository.tsx는 Indexed DBRepository.tsx와 LocalDBRepository.tsx 를 구현할 예정임
   
   이 클래스는 인터페이스만 선언함.   

*/

class IStorage {
    // put(tableName, key, value) {}
    // get(tableName, key) {}
    // getAll(tableName) {}
    // remove(tableName, key) {}
    // clear(tableName) {}
}