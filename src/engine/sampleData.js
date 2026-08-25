// Realistic Sample Timetable Dataset for Taibah University Demo
import { TimetableParser } from './parser.js';

export const SAMPLE_TAIBAH_HTML = `
<!DOCTYPE html>
<html>
<body>
  <table>
    <tbody>
      <tr>
        <th>المسجل</th><th>المتاح</th><th>الخميس</th><th>الأربعاء</th><th>الثلاثاء</th><th>الاثنين</th><th>الأحد</th><th>أستاذ المادة</th><th>الشعبة</th><th>اسم المادة</th><th>رقم المادة</th><th>رمز المادة</th><th>الفرع</th><th>م</th>
      </tr>
      <!-- CS 181: Introduction to Programming -->
      <tr><td>22</td><td>30</td><td></td><td>08:00-09:50</td><td></td><td>08:00-09:50</td><td></td><td>د. أحمد الجهني</td><td>1A</td><td>مقدمة في البرمجة</td><td>181</td><td>CS</td><td>المدينة</td><td>101</td></tr>
      <tr><td>28</td><td>30</td><td></td><td>10:00-11:50</td><td></td><td>10:00-11:50</td><td></td><td>د. أحمد الجهني</td><td>1B</td><td>مقدمة في البرمجة</td><td>181</td><td>CS</td><td>المدينة</td><td>102</td></tr>
      <tr><td>15</td><td>30</td><td>12:00-13:50</td><td></td><td>12:00-13:50</td><td></td><td></td><td>د. سمير السالمي</td><td>2A</td><td>مقدمة في البرمجة</td><td>181</td><td>CS</td><td>المدينة</td><td>103</td></tr>

      <!-- MATH 101: Calculus I -->
      <tr><td>25</td><td>35</td><td>08:00-09:50</td><td></td><td>08:00-09:50</td><td></td><td>08:00-09:50</td><td>د. محمد الغامدي</td><td>11</td><td>تفاضل وتكامل 1</td><td>101</td><td>MATH</td><td>المدينة</td><td>104</td></tr>
      <tr><td>30</td><td>35</td><td>10:00-11:50</td><td></td><td>10:00-11:50</td><td></td><td>10:00-11:50</td><td>د. ياسر الشريف</td><td>12</td><td>تفاضل وتكامل 1</td><td>101</td><td>MATH</td><td>المدينة</td><td>105</td></tr>
      <tr><td>35</td><td>35</td><td></td><td>13:00-14:50</td><td></td><td>13:00-14:50</td><td></td><td>د. محمد الغامدي</td><td>13</td><td>تفاضل وتكامل 1</td><td>101</td><td>MATH</td><td>المدينة</td><td>106</td></tr>

      <!-- PHYS 101: General Physics -->
      <tr><td>20</td><td>30</td><td></td><td>09:00-10:50</td><td></td><td>09:00-10:50</td><td></td><td>د. فهد الحازمي</td><td>5A</td><td>فيزياء عامة</td><td>101</td><td>PHYS</td><td>المدينة</td><td>107</td></tr>
      <tr><td>18</td><td>30</td><td></td><td>11:00-12:50</td><td></td><td>11:00-12:50</td><td></td><td>د. فهد الحازمي</td><td>5B</td><td>فيزياء عامة</td><td>101</td><td>PHYS</td><td>المدينة</td><td>108</td></tr>
      <tr><td>29</td><td>30</td><td>13:00-14:50</td><td></td><td>13:00-14:50</td><td></td><td></td><td>د. طارق المطيري</td><td>5C</td><td>فيزياء عامة</td><td>101</td><td>PHYS</td><td>المدينة</td><td>109</td></tr>

      <!-- ISLS 101: Islamic Culture -->
      <tr><td>40</td><td>50</td><td></td><td></td><td></td><td></td><td>10:00-11:50</td><td>د. صالح الأحمدي</td><td>21</td><td>الثقافة الإسلامية 1</td><td>101</td><td>ISLS</td><td>المدينة</td><td>110</td></tr>
      <tr><td>45</td><td>50</td><td></td><td></td><td></td><td>12:00-13:50</td><td></td><td>د. صالح الأحمدي</td><td>22</td><td>الثقافة الإسلامية 1</td><td>101</td><td>ISLS</td><td>المدينة</td><td>111</td></tr>
      <tr><td>50</td><td>50</td><td></td><td></td><td>10:00-11:50</td><td></td><td></td><td>د. عبدالرحمن الزهراني</td><td>23</td><td>الثقافة الإسلامية 1</td><td>101</td><td>ISLS</td><td>المدينة</td><td>112</td></tr>

      <!-- ENG 101: Academic English -->
      <tr><td>24</td><td>25</td><td></td><td>12:00-13:50</td><td></td><td>12:00-13:50</td><td></td><td>د. جون سميث</td><td>01</td><td>اللغة الإنجليزية الأكاديمية</td><td>101</td><td>ENG</td><td>المدينة</td><td>113</td></tr>
      <tr><td>20</td><td>25</td><td>10:00-11:50</td><td></td><td>10:00-11:50</td><td></td><td></td><td>د. ديفيد ويليامز</td><td>02</td><td>اللغة الإنجليزية الأكاديمية</td><td>101</td><td>ENG</td><td>المدينة</td><td>114</td></tr>

      <!-- CS 212: Data Structures -->
      <tr><td>19</td><td>25</td><td></td><td>08:00-09:50</td><td></td><td>08:00-09:50</td><td></td><td>د. رامي الحربي</td><td>10</td><td>تراكيب البيانات</td><td>212</td><td>CS</td><td>المدينة</td><td>115</td></tr>
      <tr><td>22</td><td>25</td><td>12:00-13:50</td><td></td><td>12:00-13:50</td><td></td><td></td><td>د. رامي الحربي</td><td>20</td><td>تراكيب البيانات</td><td>212</td><td>CS</td><td>المدينة</td><td>116</td></tr>
    </tbody>
  </table>
</body>
</html>
`;

export function getSampleSections() {
  const result = TimetableParser.parseHtml(SAMPLE_TAIBAH_HTML);
  return result.sections || [];
}
