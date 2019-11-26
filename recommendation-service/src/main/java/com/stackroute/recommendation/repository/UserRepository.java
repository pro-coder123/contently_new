package com.stackroute.recommendation.repository;

import com.stackroute.recommendation.domain.*;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface UserRepository extends Neo4jRepository<User, Long> {



    @Query("match (g:Genre),(u:User{name:{username}}),(b:User),(v:Book),(k:Book) where (u)-[:bought]->(v)<-[:bought]-(b)-[:bought]->(k:Book)  return distinct k")
    Collection<Book> bookReccomendation(@Param("username") String name);                // book recommendation

    @Query("match(u:User),(uu:User),(b:Book),(g:Gender),(a:ageGroup) where u.name= {username} and (u)-[:has_gender]->(g)<-[:has_gender]-(uu) and  (u)-[:has_ageGroup]->(a)<-[:has_ageGroup]-(uu) and (uu)-[:bought]->(b) return b")
    Collection<Book> getRecAccProfile(@Param("username") String username); //working

    @Query("match(u:User{name:{username}}),(b:Book),(g:Genre) where (u)-[:likes]->(g)<-[:has_genre]-(b) return distinct b")
    Collection<Book> getRecAccLikes(@Param("username") String username);

    @Query("match(u:User{name: {username} }),(b:Book),(c:Book),(a:User) where (u)-[:bought]->(b)<-[:has_wrote]-(a)-[:has_wrote]->(c) return distinct c")
    Collection<Book> getRecAccAuth(@Param("username") String username);


    @Query("match(u:User),(r:Role{name:'editor'}),(g:Genre{name:{genre}}) where (u)-[:has_role]->(r) and (u)-[:likes]->(g) return u Order by u.cost,u.exp DESC")
    Collection<User> getEditorRec(@Param("genre") String genre);   //editor recc

    @Query("match(u:User),(r:Role{name:'designer'}),(g:Genre{name:{genre}}) where (u)-[:has_role]->(r) and (u)-[:likes]->(g) return u Order by u.cost,u.exp DESC")
    Collection<User> getIllustratorRec(@Param("genre") String genre);   //illustrator recc

    @Query("match(u:User{name:{author}}) create(b:Book{bookName:{title},bookId:{bookId},bookPrice:{price},nop:{nop}}) ,(u)-[:has_wrote]->(b)")
    void savePublication(@Param("title") String title,@Param("author") String author,@Param("bookId") int bookId,@Param("nop") int nop,@Param("price") double price);

    @Query("match (u:User{name:{username}}),(b:Book{bookId:{bookId}})\n"+"set b.nop=b.nop+1\n"+
            "create (u)-[:bought]->(b)")
    void savePurchasing(@Param("bookId") int bookId,@Param("username") String username);

    @Query("match(b:Book{bookId:{bookId}}),(u:User{name:{editor}}) create (e)-[:has_edited]->(b)")
    void saveEditor(@Param("editor") String editor,@Param("bookId") int bookId);

    @Query("match(b:Book{bookId:{bookId}}),(u:User{name:{designer}}) create (e)-[:has_designed]->(b)")
    void saveDesigner(@Param("designer") String editor,@Param("bookId") int bookId);

    @Query("match(u:User{name:{username}}) set u.exp=u.exp+1")
    void incrExp(@Param("username") String username);


    @Query("match(b:Book) Return b " +
            "Order by b.created_at desc" +
            ",b.nop desc  Limit 15  ")
    Collection<Book> getTrending();

    @Query("match(u:User{name:{username}}),(g:Genre{name:{genre}}) create (u)-[:likes]->(g)")
    void saveGenre(@Param("genre") String genre,@Param("username") String username);


    @Query("match (g:Genre{name:{genre}}) return g")
    List<Genre> getGenre(@Param("genre") String genre);

    @Query("create (g:Genre{name:{genre}}) return g")
    Genre saveThisGenre(@Param("genre") String genre);

    @Query("create (t:Type{name:{type}}) return t")
    Type createType(@Param("type") String type);

    @Query("match (t:Type{name:{type}}) return t")
    List<Type> getType(@Param("type") String type);

    @Query("match (g:Gender{name:{gender}}) return g")
    List<Gender> getGender(@Param("gender") String gender);

    @Query("match (r:Role{name:{role}}) return r")
    List<Role> getRole(@Param("role") String role);

    @Query("match (a:ageGroup{name:{ageGroup}}) return a")
    List<ageGroup> getAgeGroup(@Param("ageGroup") String ageGroup);

    @Query("match (n:nationality{name:{nationality}}) return n")
    List<Type> getNationality(@Param("nationality") String nationality);

    @Query("match (b:Book{bookId:{bookId}}),(g:Genre{name:{genre}}) create (b)-[:has_genre]->(g)")
    void saveBookGenre(@Param("genre") String genre,@Param("bookId") int bookId);

    @Query("match(u:User{name:{username}}),(r:Role{name:'editor'}) create (u)-[:has_role]->(r)")
    void createEditor(@Param("username") String username);

    @Query("match(u:User{name:{username}}),(r:Role{name:'designer'}) create (u)-[:has_role]->(r)")
    void createDesigner(@Param("username") String username);

    @Query("match(u:User{name:{username}}) set u.cost={cost},u.exp={exp}")
    void  saveExpCost(@Param("exp") int exp,@Param("cost") double cost,@Param("username") String username);

    @Query("match(u:User{name:{username}}),(a:ageGroup{name:{ageGroup}}) create (u)-[:has_ageGroup]->(a) ")
    void setAgeGroup(@Param("ageGroup") String ageGroup,@Param("username") String username);

    @Query("match(u:User{name:{username}}),(g:Gender{name:{gender}}) create (u)-[:has_gender]->(g)")
    void setGender(@Param("gender") String ageGroup,@Param("username") String username);

    @Query("match(u:User{name:{username}}),(n:nationality{name:{nationality}}) create (u)-[:has_nationality]->(n)")
    void setNationality(@Param("nationality") String ageGroup,@Param("username") String username);



    @Query("create (g:Gender{name:{gender}})")
    void createGender(@Param("gender") String gender);

    @Query("create (g:ageGroup{name:{ageGroup}})")
    void createAgeGroup(@Param("ageGroup") String ageGroup);

    @Query("create (g:nationality{name:{nationality}})")
    void createNationality(@Param("nationality") String nationality);

    @Query("create (r:Role{name:{role}})")
    void createRole(@Param("role") String role);

    @Query("create (u:User{name:{username},cost:{cost},exp:{exp}})")
    void createUser(@Param("username") String username,@Param("exp") int exp,@Param("cost") double cost);


    @Query("match(g:Genre{name:{genre}})<-[:has_genre]-(b:Book)<-[r:bought]-(u:User) Return u  Order by r.created_at desc  Limit 1000")
    List<User> getPriceRec(@Param("genre") String genre);

    @Query("LOAD CSV WITH HEADERS FROM \"file:///users.csv\" AS csvLine\n" +
            "MERGE (g:Gender {name: csvLine.gender})\n" +
            "MERGE (n:Nationality {name: csvLine.nationality})\n"+
            "MERGE (a:AgeGroup {name: csvLine.agegroup})\n" +
            "MERGE (s:Status {name: csvLine.status})\n" +
            "MERGE (r:Role {name: csvLine.role})\n" +
            "CREATE (u:User {idd: toInteger(csvLine.id), name: csvLine.name})\n" +
            "CREATE (u)-[:has_gender]->(g)\n"+
            "CREATE (u)-[:has_status]->(s)\n"+
            "CREATE (u)-[:has_role]->(r)\n"+
            "CREATE (u)-[:has_nationality]->(n)\n"+
            "CREATE (u)-[:has_agegroup]->(a)")
    void dop();

    @Query("LOAD CSV WITH HEADERS FROM \"file:///books.csv\" AS csvLine\n" +
            "            MERGE (g:Genre {name: csvLine.genre})\n" +
            "            MERGE (t:Type {name: csvLine.type})\n" +
            "            MERGE (u:User {name: csvLine.author}) \n" +
            "            CREATE (b:Book {idd: toInteger(csvLine.id), bookName: csvLine.name, timesPurchased: toInteger(csvLine.noofpurchases) , description: csvLine.description })\n" +
            "            CREATE (b)-[:has_genre]->(g)\n" +
            "            CREATE (u)-[:has_authored]->(b)\n" +
            "            CREATE (b)-[:has_type]->(t)")
    void pop();

    @Query("LOAD CSV WITH HEADERS FROM \"file:///bought.csv\" AS csvLine\n" +
            "MATCH (u:User {idd: toInteger(csvLine.uid)}),(b:Book {idd: toInteger(csvLine.mid)})\n" +
            "CREATE (u)-[:bought]->(b)")
    void bob();

    @Query("create (r:Role{name:'editor'}),(t:Role{name:'designer'}),(h:Gender{name:'male'}),(g:Gender{name:'female'})," +
            "(n:nationality{name:'indian'}),(y:ageGroup{name:'k'}),(a:ageGroup{name:'t'}),(b:ageGroup{name:'a'}),(z:ageGroup{name:'o'})")
    void top();



}

