import { nanoid } from "nanoid";
import * as db from "./transcriptManager";

/*
Tests for the Transcript Manager. 
 */
describe('TranscriptManager', () => {

  beforeEach(() => {
    // Before any test runs, clean up the datastore. This should ensure that tests are hermetic.
    db.initialize();
    expect(db.getAll()).toEqual([]);
  })

  describe('Create student', () => {
    it('should return an ID, starting with 1', () => {
      const ret = db.addStudent('avery');
      expect(ret).toEqual(1);
    });

    it('should return a student with empty transcript', () => {
      const ret = db.addStudent('avery');
      const newStudent = { studentID: ret, studentName: 'avery' };
      expect(db.getTranscript(ret)).toEqual({student: newStudent, grades: []});
    });
  })
  describe('Adding grades', () => {
    it('should add the grade to the transcript', () => {
      const studentID = db.addStudent('test student');
      db.addGrade(studentID, 'test course', 100);
      const grade = db.getGrade(studentID, 'test course');
      expect(grade).toBe(100);
    })
    it('should add the grade to correct student\'s transcript with multiple students in database', () => {
      const studentID1 = db.addStudent('test student 1');
      const studentID2 = db.addStudent('test student 2');
      db.addGrade(studentID2, 'test course', 100);
      const grade = db.getGrade(studentID2, 'test course');
      expect(grade).toBe(100);
    })
    it('should add grade with multiple grades in transcript ', () => {
      const studentID = db.addStudent('test student 1');
      db.addGrade(studentID, 'test course 1', 100);
      db.addGrade(studentID, 'test course 2', 90);
      const grade1 = db.getGrade(studentID, 'test course 1');
      const grade2 = db.getGrade(studentID, 'test course 2');
      expect(grade1).toBe(100);
      expect(grade2).toBe(90);
    })
    it('Should throw an error if the student ID is invalid', () =>{
      expect(() => db.addGrade(1, 'test course', 100)).toThrowError();
    });
    it('Should throw an error if the grade for the student ID already exists', () =>{
      const studentID = db.addStudent('test student');
      db.addGrade(studentID, 'test course', 100);
      expect(() => db.addGrade(studentID, 'test course', 80)).toThrowError();
    });
  })
  describe('getStudentIDs', () => {
    it('Should return only the students who match the name', () => {
      const avery1 = db.addStudent('avery');
      const avery2 = db.addStudent('avery');
      const ripley = db.addStudent('ripley');

      //Probably should be checking if arrays contain same set of IDs, permitting different orders...
      expect(db.getStudentIDs('avery')).toEqual([avery1, avery2]);
      expect(db.getStudentIDs('ripley')).toEqual([ripley]);
    })
  });
  describe('Deleting students', () => {
    it('Should result in the students\' transcript no longer being available', () => {
      const studentID = db.addStudent('test student');
      db.deleteStudent(studentID);
      expect(db.getTranscript(studentID)).toBeUndefined();
    })
    it('Should throw an error if the ID is invalid', ()=>{
      expect(()=>db.deleteStudent(10)).toThrowError();
    })
    it('Should delete the correct student with multiple students in database', () => {
      const studentID1 = db.addStudent('test student 1');
      const studentID2 = db.addStudent('test student 2');
      db.deleteStudent(studentID2);
      expect(db.getTranscript(studentID2)).toBeUndefined();
    })
  })
  describe('getAll', () => {
    it('Should return the transcripts', () => {
      expect(db.getAll()).toEqual([]);
    });
  });
  describe('getGrade', () => { 
    it('Should throw error if course does not exist on transcript', ()  => {
      const studentID = db.addStudent('test student');
      expect(()=>db.getGrade(studentID, 'test course')).toThrowError();
    })
    it('Should throw error if there are no transcripts', ()  => {
      expect(()=>db.getGrade(0, 'test course')).toThrowError();
    })
  });
   describe('getTranscript', () => { 
    it('Transcript that is returned has same studentID as original request', ()  => {
      const studentID1 = db.addStudent('test student 1');
      const studentID2 = db.addStudent('test student 2');
      const transcript = db.getTranscript(studentID2);
      expect(transcript?.student.studentID).toEqual(studentID2);
    })
   });
});
